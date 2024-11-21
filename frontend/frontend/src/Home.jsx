import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Home() {
    const [files, setFiles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    
    const fetchFiles = async () => {
        try 
        {
            const response = await axios.get('http://localhost:4000/files');
            setFiles(response.data);
        } 
        catch (error) 
        {
            console.error('Błąd podczas pobierania plików:', error);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

   
    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try 
        {
            await axios.post('http://localhost:4000/upload', formData);
            alert('Plik został przesłany pomyślnie.');
            fetchFiles();
        } 
        catch (error)
        {
            console.error('Błąd podczas przesyłania pliku:', error);
            alert('Nie udało się przesłać pliku.');
        }
    };

   
    const handleDownload = async (filename) => {
        try 
        {
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
        } 
        catch (error)
        {
            console.error('Błąd podczas pobierania pliku:', error);
            alert('Nie udało się pobrać pliku.');
        }
    };

    
    const handleDelete = async (filename) => {
        try 
        {
            await axios.delete(`http://localhost:4000/delete/${filename}`);
            alert('Plik został usunięty pomyślnie.');
            fetchFiles();
        } 
        catch (error) 
        {
            console.error('Błąd podczas usuwania pliku:', error);
            alert('Nie udało się usunąć pliku.');
        }
    };

    
    const formatFileName = (name) => {
        const maxLength = 15;
        const extension = name.split('.').pop(); 
        const baseName = name.slice(0, name.lastIndexOf('.'));
    
        if (baseName.length > maxLength) 
        {
            return `${baseName.slice(0, maxLength)}...${extension}`;
        } 
        else 
        {
            return name;
        }
    };
    

    return (
        
        <div className="cloud-service-container">
            <h1 className="title" align="center">Magazyn plików</h1>
            <input
                type="text"
                placeholder="Wyszukaj pliki..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
            />

            
            <div className="file-list">
                {files.length > 0 ? (
                    files
                        .filter((file) => file.toLowerCase().includes(searchTerm.toLowerCase()))
                        .map((file, index) => (
                            <div
                                key={index}
                                className={`file-item ${selectedFile === file ? 'selected' : ''}`}
                                onClick={() => setSelectedFile(file)}
                            >
                                {formatFileName(file)}
                            </div>
                        ))
                ) : (
                    <p>Brak załadowanych plików.</p>
                )}
            </div>

            
            <div className="actions">
                <label htmlFor="upload-input" className="upload-button">
                    Upload
                </label>
                <input
                    type="file"
                    id="upload-input"
                    style={{ display: 'none' }}
                    onChange={handleUpload}
                />
                <button
                    className="download-button"
                    onClick={() => {
                        if (selectedFile)
                        {
                            handleDownload(selectedFile);
                        } 
                        else 
                        {
                            alert('Wybierz plik do pobrania.');
                        }
                    }}
                >
                    Download
                </button>
                <button
                    className="delete-button"
                    onClick={() => {
                        if (selectedFile) 
                        {
                            handleDelete(selectedFile);
                        } 
                        else 
                        {
                            alert('Wybierz plik do usunięcia.');
                        }
                    }}
                >
                    Delete
                </button>
            </div>
        </div>
    );
}

export default Home;
