export const generateNewUserEmail = ({
  username,
  password
}: {
  username: string
  password: string
}) => `<!DOCTYPE html>
  <html lang="es">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> 
    <style>
      * {
        box-sizing: border-box;
      }
  
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        height: 100%;
      }
  
      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 20px;
      }
  
      .header {
        text-align: center;
        padding: 20px;
        background-color: #EA5816;
        color: white;
        font-weight: 600;
        width: 100%;
      }
  
      .content {
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 1rem;
      }
  
      .content h2 {
        color: #333333;
      }
  
      .content p {
        color: #555555;
      }
  
      .results {
        margin-top: 20px;
      }
  
      .result-item {
        border-bottom: 1px solid #dddddd;
        padding: 10px 0;
      }
  
      .result-item:last-child {
        border-bottom: none;
      }
  
      .result-item img {
        max-width: 100%;
        height: auto;
      }
  
      .result-item .details {
        margin-left: 20px;
      }
  
      .footer {
        text-align: center;
        padding: 20px;
        background-color: #EA5816;
        color: white;
        font-weight: 600;
        width: 100%;
      }
  
      .babidi {
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr;
        gap: 0.5rem;
      }
  
      .babidi > div {
        margin: 0 auto;
        text-align:center;
      }
  
      .linkButton {
        background-color: #EA5816;
        color: white;
        padding: 1rem 2rem;
        border-radius: 4px;
        text-align: center;
        text-decoration: none;
        font-weight: 600;
        }
  
      @media (max-width: 600px) {
        .result-item {
          display: block;
        }
  
        .result-item img {
          width: 100%;
        }
  
        .result-item .details {
          margin-left: 0;
          margin-top: 10px;
        }
      }
    </style>
  </head>
  
  <body>
    <main>
      <div class="header">
        <h1>SocialBoost</h1>
      </div>
      <div class="content">
        <div class="babidi">
            <h1>Muchas gracias por confiar en nosotros!</h1>
            <p>Le enviamos los datos de sesion, recuerde que la contraseña es generada automaticamente, puede cambiarla cuando lo desee. Tambien recuerde que es personal y no debe compartirla con nadie.</p>  
        <p>Usuario: ${username}</p>
        <p>Contraseña: ${password}</p>
        <a href="https://blim.neurcrm.com/login" class="linkButton">Acceder a la plataforma</a>
        </div>
      </div>
      <div class="footer">
        <p>Gracias por utilizar nuestro servicio.</p>
      </div>
    </main>
  </body>
  </html>`
