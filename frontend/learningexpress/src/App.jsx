import { useEffect, useState } from "react";

const API = "http://localhost:4000";

function App() {

    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    // GET FILES
    const getFiles = async () => {

        try {

            const response = await fetch(API);

            if (!response.ok) {
                throw new Error("Failed to fetch files");
            }

            const data = await response.json();

            setFiles(data);

        } catch (error) {

            console.log("GET ERROR:", error);

        } finally {

            setLoading(false);

        }
    };


    // OPEN FILE
    const openFile = (file) => {

        window.open(
            `${API}/${encodeURIComponent(file)}`,
            "_blank"
        );

    };


    // DOWNLOAD FILE
    const downloadFile = (file) => {

        window.open(
            `${API}/${encodeURIComponent(file)}?action=download`,
            "_blank"
        );

    };


    // DELETE FILE
    const deleteFile = async (file) => {

        console.log("Deleting file:", file);

        const confirmed = window.confirm(
            `Delete "${file}"?`
        );

        if (!confirmed) {
            return;
        }

        try {

            const response = await fetch(
                `${API}/${encodeURIComponent(file)}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            console.log("DELETE RESPONSE:", data);

            if (!response.ok) {

                alert(
                    data.message ||
                    "Failed to delete file"
                );

                return;
            }

            alert(data.message);

            setFiles((oldFiles) =>
                oldFiles.filter(
                    (item) => item !== file
                )
            );

        } catch (error) {

            console.error(
                "DELETE ERROR:",
                error
            );

            alert("Failed to delete file");

        }

    };


    // UPLOAD FILE
    const uploadFile = () => {

        const input = document.createElement("input");

        input.type = "file";

        input.onchange = async (event) => {

            const file = event.target.files[0];

            if (!file) {
                return;
            }

            console.log("Uploading:", file.name);

            try {

                const response = await fetch(
                    `${API}/${encodeURIComponent(file.name)}`,
                    {
                        method: "POST",
                        body: file,
                    }
                );

                const data = await response.json();

                console.log(
                    "UPLOAD RESPONSE:",
                    data
                );

                if (!response.ok) {

                    alert(
                        data.message ||
                        "Upload failed"
                    );

                    return;
                }

                alert(data.message);

                // Refresh file list
                getFiles();

            } catch (error) {

                console.error(
                    "UPLOAD ERROR:",
                    error
                );

                alert("Failed to upload file");

            }

        };

        input.click();

    };


    // RENAME FILE
    const renameFile = async (file) => {

        const newName = window.prompt(
            "Enter new file name:",
            file
        );

        if (!newName || newName === file) {
            return;
        }

        try {

            const response = await fetch(
                `${API}/${encodeURIComponent(file)}`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        newName: newName,
                    }),
                }
            );

            const data = await response.json();

            console.log(
                "RENAME RESPONSE:",
                data
            );

            if (!response.ok) {

                alert(
                    data.message ||
                    "Failed to rename file"
                );

                return;
            }

            alert(data.message);

            getFiles();

        } catch (error) {

            console.error(
                "RENAME ERROR:",
                error
            );

            alert("Failed to rename file");

        }

    };


    // LOAD FILES
    useEffect(() => {

        getFiles();

    }, []);


    return (

        <div style={styles.container}>

            <div style={styles.card}>

                <div style={styles.header}>

                    <h1>
                        📁 My File Manager
                    </h1>

                    <button
                        style={styles.upload}
                        onClick={uploadFile}
                    >
                        + Upload File
                    </button>

                </div>


                {loading ? (

                    <p>
                        Loading files...
                    </p>

                ) : files.length === 0 ? (

                    <p style={styles.empty}>
                        No files found
                    </p>

                ) : (

                    files.map((file) => (

                        <div
                            key={file}
                            style={styles.file}
                        >

                            <span style={styles.fileName}>
                                📄 {file}
                            </span>


                            <div style={styles.buttons}>

                                <button
                                    style={styles.open}
                                    onClick={() =>
                                        openFile(file)
                                    }
                                >
                                    Open
                                </button>


                                <button
                                    style={styles.download}
                                    onClick={() =>
                                        downloadFile(file)
                                    }
                                >
                                    Download
                                </button>


                                <button
                                    style={styles.rename}
                                    onClick={() =>
                                        renameFile(file)
                                    }
                                >
                                    Rename
                                </button>


                                <button
                                    style={styles.delete}
                                    onClick={() =>
                                        deleteFile(file)
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>

    );

}


const styles = {

    container: {
        minHeight: "100vh",
        background: "#f5f5f5",
        padding: "40px",
        fontFamily: "Arial, sans-serif",
    },


    card: {
        maxWidth: "900px",
        margin: "auto",
        background: "white",
        padding: "30px",
        borderRadius: "15px",
    },


    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "25px",
    },


    upload: {
        border: "none",
        padding: "10px 16px",
        background: "#2563eb",
        color: "white",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "14px",
    },


    file: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "15px",
        marginBottom: "10px",
        border: "1px solid #ddd",
        borderRadius: "10px",
    },


    fileName: {
        fontSize: "16px",
        fontWeight: "500",
    },


    buttons: {
        display: "flex",
        gap: "8px",
    },


    open: {
        border: "none",
        padding: "8px 12px",
        cursor: "pointer",
    },


    download: {
        border: "none",
        padding: "8px 12px",
        background: "#222",
        color: "white",
        cursor: "pointer",
    },


    rename: {
        border: "none",
        padding: "8px 12px",
        background: "#ddd",
        cursor: "pointer",
    },


    delete: {
        border: "none",
        padding: "8px 12px",
        background: "red",
        color: "white",
        cursor: "pointer",
    },


    empty: {
        textAlign: "center",
        color: "#777",
    },

};


export default App;