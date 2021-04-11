## API

### Passwords

|HTTP Method| API URL | What it does | Sample Body |
|:---------:|:-------:|:------------:|:-----------:|
|GET   |  /api/v1/passwords     | get all passwords | - |
|GET   |  /api/v1/passwords/:id | get a password with a specific id | - |
|POST  |  /api/v1/passwords     | create a new password | { "url": "https://rocket.com", "username": "Hasin Apurbo", "password": "Why would I tell you???", "folderId": "-1" } |
|PUT   |  /api/v1/passwords/:id | update an existing password | { "url": "https://rocket.com", "username": "Hasin Apurbo", "password": "Why would I tell you???", "folderId": "60687f9afe53e935b501263a" } |
|DELETE|  /api/v1/passwords/:id | update an existing password | - |

### Files

|HTTP Method| API URL | What it does | Sample Body |
|:---------:|:-------:|:------------:|:-----------:|
|GET   |  /api/v1/files     | get all files | - |
|GET   |  /api/v1/files/:id | get a file with a specific id | - |
|POST  |  /api/v1/files     | create a new file | { "fileName": "certificate.pdf", "folderId": "-1" } |
|PUT   |  /api/v1/files/:id | update an existing file | { "fileName": "certificate.pdf", "folderId": "60687f9afe53e935b501263a" } |
|DELETE|  /api/v1/files/:id | update an existing file | - |

### Folders

|HTTP Method| API URL | What it does | Sample Body |
|:---------:|:-------:|:------------:|:-----------:|
|GET   |  /api/v1/folders     | get all folders | - |
|GET   |  /api/v1/folders/:id | get a folder with a specific id | - |
|POST  |  /api/v1/folders     | create a new folder | { "folderName": "certificate.pdf" } |
|PUT   |  /api/v1/folders/:id | update an existing folder | { "folderName": "certificate.pdf" } |
|DELETE|  /api/v1/folders/:id | update an existing folder | - |

## Models
