<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Réinitialisation du mot de passe</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            color: #333;
            margin: 0;
            padding: 20px;
        }
        .email-container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            max-width: 600px;
            margin: 20px auto;
            text-align: center;
        }
        a {
            color: #0066cc;
            text-decoration: none;
            font-weight: bold;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <h1>Réinitialisation du mot de passe</h1>
        <p>Bonjour</p>
        <p>Vous avez demandé à réinitialiser votre mot de passe. Veuillez cliquer sur le lien ci-dessous pour continuer :</p>
        <p>
            <a href="http://localhost:3030/ResetPassword?token={{ $token }}&email={{ urlencode($email) }}">
                Réinitialiser le mot de passe
            </a>
        </p>
        <p>Si vous n'avez pas demandé à réinitialiser votre mot de passe, veuillez ignorer cet e-mail.</p>

    </div>
</body>
</html>
