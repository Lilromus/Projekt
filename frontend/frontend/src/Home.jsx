import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
    const [files, setFiles] = useState([]);// Lista plików dostępnych na serwerze
    const [searchTerm, setSearchTerm] = useState('');// Fraza wyszukiwania
    const [selectedFile, setSelectedFile] = useState(null);// Nazwa wybranego pliku
    const [isDragging, setIsDragging] = useState(false);// Czy użytkownik przeciąga plik

    const fetchFiles = async () => {//Wysylanie zadanie GET do endpointa /files aby pobrac liste plikow(np upload)
        try {
            const response = await axios.get('http://localhost:4000/files');
            setFiles(response.data);
        } catch (error) {
            console.error('Błąd podczas pobierania plików:', error);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleUpload = async (file) => {//Funkcja do przejmowanie obiekt pliku i wysyla za pomoca GET
        if (!file) return;

        const formData = new FormData();//FormData aby przeslac dane pliku jak czesc formularza 
        formData.append('file', file);

        try {
            await axios.post('http://localhost:4000/upload', formData);
            alert('Plik został przesłany pomyślnie.');
            fetchFiles();//odswiezanie liste zakupow
        } catch (error) {
            console.error('Błąd podczas przesyłania pliku:', error);
            alert('Nie udało się przesłać pliku.');
        }
    };

    const handleDrop = (e) => {//przesyla plik gdy sie opuszcza plik w stefe draga
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles.length > 0) {
            handleUpload(droppedFiles[0]);
        }
    };

    const handleDragOver = (e) => {//wskaznik ze plik jest poza strefa
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {//reset stanu isDragging
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDownload = async (filename) => {//funkcja do pobieranie plikow jako blob
        try {
            const response = await axios.get(`http://localhost:4000/download/${filename}`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Błąd podczas pobierania pliku:', error);
            alert('Nie udało się pobrać pliku.');
        }
    };

    const handleDelete = async (filename) => {//funkcja do usuwania i wysyla zadanie DELETE do endpointa /delete/;nazwapliku
        try {
            await axios.delete(`http://localhost:4000/delete/${filename}`);
            alert('Plik został usunięty pomyślnie.');
            fetchFiles();
        } catch (error) {
            console.error('Błąd podczas usuwania pliku:', error);
            alert('Nie udało się usunąć pliku.');
        }
    };

    const formatFileName = (name) => {//skracanie dlugosc nazw zachowajac rozszerzenie pliku na koncu, bo to zmienia caly interfej gyd plik ma dluga nazwe
        const maxLength = 15;
        const extension = name.split('.').pop();
        const baseName = name.slice(0, name.lastIndexOf('.'));

        if (baseName.length > maxLength) {
            return `${baseName.slice(0, maxLength)}...${extension}`;
        } else {
            return name;
        }
    };

    return (//caly htmlowy return
        <div className="cloud-service-container">
            <h1 className="title" align="center">Magazyn plików</h1>
            <input type="text" placeholder="Wyszukaj pliki..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-bar"/>

            <div className={`drop-zone ${isDragging ? 'dragging' : ''}`} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
        {(() => {
        if (isDragging) 
        {
            return <p>Upuść plik tutaj...</p>;
        } 
        else 
        {
            return <p>Przeciągnij i upuść plik lub kliknij przycisk Upload</p>;
        }
        })()}
        </div>

            <div className="file-list">
            {(() => {
                if (files.length > 0) {
                    return files
                    .filter((file) => file.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((file, index) => (
                        <div key={index} className={`file-item ${selectedFile === file ? 'selected' : ''}`} onClick={() => setSelectedFile(file)}>
                            {formatFileName(file)}
                        </div>
                ));
                } 
                else 
                {
                    return <p>Brak załadowanych plików.</p>;
                }
            })()}
            </div>


            <div className="actions">
                <label htmlFor="upload-input" className="upload-button">
                    Upload
                </label>
                <input type="file" id="upload-input" style={{ display: 'none' }} onChange={(e) => handleUpload(e.target.files[0])}/>
                <button className="download-button" onClick={() => {
                        if (selectedFile) {
                            handleDownload(selectedFile);
                        } else {
                            alert('Wybierz plik do pobrania.');
                        }
                    }}>
                    Download
                </button>
                <button className="delete-button" onClick={() => {
                        if (selectedFile) 
                        {
                            handleDelete(selectedFile);
                        } 
                        else
                        {
                            alert('Wybierz plik do usunięcia.');
                        }}}>
                    Delete
                </button>
            </div>
        </div>
    );
}

export default Home;
