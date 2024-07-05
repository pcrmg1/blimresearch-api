import fs from "fs";
import path from "path";
import multer from "multer";
import archiver from "archiver";
import { Router } from "express";
import { mergeTextWithImage } from "../libs/images/generate";

export const mediaCreationRouter = Router();

const upload = multer({
  fileFilter: (_, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
  storage: multer.diskStorage({
    destination: (_, __, cb) => {
      fs.mkdir("uploads/", (err) => {
        cb(null, "uploads/");
      });
    },
    filename: (_, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
});

mediaCreationRouter.post(
  "/upload",
  upload.single("file"),
  async (req: any, res) => {
    let imagePath: string;

    if (req.file) {
      imagePath = req.file.path;
    } else if (req.body.predefinedImage) {
      imagePath = path.join("uploads", path.basename(req.body.predefinedImage));
    } else {
      return res
        .status(400)
        .send("No file uploaded or predefined image selected");
    }

    const texts: string[] = JSON.parse(req.body.texts);
    const options = JSON.parse(req.body.options);
    const folderPath: string = "uploads/compressed";

    try {
      if (fs.existsSync(folderPath)) {
        fs.rmSync(folderPath, { recursive: true });
      }

      fs.mkdirSync(folderPath, { recursive: true });

      for (const text of texts) {
        const imageBuffer = await mergeTextWithImage(imagePath, text, options);
        if (!imageBuffer) {
          return res.status(500).send("Error generating the image.");
        }
        const imageFileName = `${new Date().toISOString()}-${text}.png`;
        const imageFilePath = path.join(folderPath, imageFileName);
        fs.writeFileSync(imageFilePath, imageBuffer);
      }

      if (req.file) {
        fs.unlinkSync(imagePath);
      }

      res.send({ path: folderPath });
    } catch (error) {
      res.status(500).send("Error generating the image.");
    }
  },
);

mediaCreationRouter.get("/download", async (req: any, res) => {
  try {
    const folderPath = req.query.folderPath;
    if (!folderPath) {
      return res.status(400).send("No path provided.");
    }

    if (!fs.existsSync(folderPath)) {
      return res.status(404).send("Path not found.");
    }

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=images.zip");

    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    archive.on("error", (err) => {
      res.status(500).send({ error: err.message });
    });

    archive.pipe(res);

    archive.directory(folderPath, false);
    await archive.finalize();
  } catch (error) {
    res.status(500).send("Error downloading the images.");
  }
});
