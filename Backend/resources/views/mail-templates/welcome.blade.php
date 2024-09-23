<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Welcome Email</title>
</head>
<body>
    <h3>Welcome {{$user->nom}} {{$user->prenom}} to Our Linkedu App</h3>
    <p>password : {{$password}}</p>
    you can login <a href="http://localhost:5173/login">login</a>
</body>
</html>
