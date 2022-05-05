# BurnAfterClicking

## Generating the secret message
```mermaid
sequenceDiagram
CLIENT ->> SERVER: HTTP GET '/'
SERVER-->> CLIENT: sendFile( index.html )
Note left of CLIENT: CLIENT fills form and encrypts data<br> using linkGen.js from generated<br> initVector and key.

CLIENT->>SERVER: HTTP POST '/api/linkgen'
Note right of SERVER: POST contains AES initVector <br>and encrypted data as UTF8.
```

## Returning the secret message
```mermaid
sequenceDiagram
Client ->> Server: HTTP GET ' /show/?i=foo&n=bar '
Server ->> Client: sendFile( show.html )
Client ->> Server: HTTP POST ' /api/linkGet/?i=foo
Server ->> Database: SELECT data FROM links<br> WHERE iv = ${req.query.i}
Database ->> Server: { data: 'AbC123=='}
Server ->> Client: HTTP 200 '{ iv: foo, data: AbC123== }'
Client ->> Client: 
Note right of Client: The client then uses iv and data combined with <br>n=bar (decryption key) from url params to decrypt data.
```
