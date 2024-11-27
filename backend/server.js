const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) 
{
    fs.mkdirSync(uploadDir);
}


app.get('/files', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err)
        {
            return res.status(500).json({ error: 'Problem z odczytem plików' });
        }
        res.json(files);
    });
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) 
    {
        return res.status(400).json({ error: 'Brak przesłanych plików' });
    }
    res.status(200).json({ message: 'Plik został przesłany pomyślnie.', file: req.file.filename });
});

app.get('/download/:filename', (req, res) => {
    const filePath = path.join(uploadDir, req.params.filename);
    if (fs.existsSync(filePath)) 
    {
        res.download(filePath);
    } 
    else 
    {
        res.status(404).json({ error: 'Nie znaleziono pliku' });
    }
});


app.post('/login', (req, res) => {
    const { login, password } = req.body;

    const validLogin = "Admin";
    const validPassword = "Owca";

    if (login === validLogin && password === validPassword) 
    {
        res.status(200).json({ message: 'Logowanie powiodło się' });
    } 
    else 
    {
        res.status(401).json({ error: 'Nieudana próba logowania' });
    }
});

app.delete('/delete/:filename', (req, res) => {
    const filePath = path.join(uploadDir, req.params.filename);
    if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
            if (err)
            {
                return res.status(500).json({ error: 'Problem z usuwaniem plika' });
            }
            res.status(200).json({ message: 'Usunięto plik' });
        });
    } 
    else 
    {
        res.status(404).json({ error: 'Plik został nie wybrany' });
    }
});

app.get('/', (req, res) => {
    res.send('Witaj w backendzie!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
