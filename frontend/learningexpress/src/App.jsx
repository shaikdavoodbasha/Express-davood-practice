import { useEffect, useState } from "react";

const API = "http://localhost:4000";

function App() {

    const [files, setFiles] = useState([]);

    const [loading, setLoading] = useState(true);

    // Current folder path
    // Example:
    // ""
    // "MyPhotos"
    // "MyPhotos/images"
    const [currentPath, setCurrentPath] = useState("");


    // ========================================
    // GET DIRECTORY
    // ========================================

    const getFiles = async (path = currentPath) => {

        try {

            setLoading(true);

            const response = await fetch(
                `${API}/directory?path=${encodeURIComponent(path)}`
            );

            const data = await response.json();

            console.log(
                "DIRECTORY:",
                path,
                data
            );

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to load files"
                );

            }

            setFiles(data);

        } catch (error) {

            console.error(
                "GET FILES ERROR:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    // ========================================
    // GET FULL FILE PATH
    // ========================================

    const getFilePath = (fileName) => {

        if (!currentPath) {

            return fileName;

        }

        return `${currentPath}/${fileName}`;

    };


    // ========================================
    // OPEN FILE
    // ========================================

    const openFile = (fileName) => {

        const filePath =
            getFilePath(fileName);


        const encodedPath =
            filePath
                .split("/")
                .map(
                    (part) =>
                        encodeURIComponent(part)
                )
                .join("/");


        window.open(
            `${API}/files/${encodedPath}`,
            "_blank"
        );

    };


    // ========================================
    // DOWNLOAD FILE
    // ========================================

    const downloadFile = (fileName) => {

        const filePath =
            getFilePath(fileName);


        const encodedPath =
            filePath
                .split("/")
                .map(
                    (part) =>
                        encodeURIComponent(part)
                )
                .join("/");


        window.open(
            `${API}/files/${encodedPath}?action=download`,
            "_blank"
        );

    };


    // ========================================
    // OPEN FOLDER
    // ========================================

    const openFolder = (folderName) => {

        const newPath = currentPath
            ? `${currentPath}/${folderName}`
            : folderName;


        setCurrentPath(newPath);

        getFiles(newPath);

    };


    // ========================================
    // GO BACK
    // ========================================

    const goBack = () => {

        if (!currentPath) {

            return;

        }


        const parts =
            currentPath.split("/");


        parts.pop();


        const parentPath =
            parts.join("/");


        setCurrentPath(parentPath);

        getFiles(parentPath);

    };


    // ========================================
    // UPLOAD SINGLE FILE
    // ========================================

    const uploadFile = () => {

        const input =
            document.createElement("input");


        input.type = "file";


        input.onchange =
            async (event) => {

                const file =
                    event.target.files[0];


                if (!file) {

                    return;

                }


                try {

                    /*
                        If we are inside:

                        MyPhotos/images

                        upload becomes:

                        MyPhotos/images/photo.jpg
                    */

                    const filePath =
                        getFilePath(file.name);


                    const encodedPath =
                        filePath
                            .split("/")
                            .map(
                                (part) =>
                                    encodeURIComponent(part)
                            )
                            .join("/");


                    const response =
                        await fetch(
                            `${API}/files/${encodedPath}`,
                            {
                                method: "POST",
                                body: file,
                            }
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {

                        alert(
                            data.message ||
                            "Upload failed"
                        );

                        return;

                    }


                    alert(
                        data.message
                    );


                    getFiles();

                } catch (error) {

                    console.error(
                        "UPLOAD ERROR:",
                        error
                    );


                    alert(
                        "Failed to upload file"
                    );

                }

            };


        input.click();

    };


    // ========================================
    // UPLOAD FOLDER
    // ========================================

    const uploadFolder = () => {

        const input =
            document.createElement("input");


        input.type = "file";


        input.webkitdirectory = true;


        input.multiple = true;


        input.onchange =
            async (event) => {

                const selectedFiles =
                    Array.from(
                        event.target.files
                    );


                if (
                    selectedFiles.length === 0
                ) {

                    return;

                }


                try {

                    for (
                        const file
                        of selectedFiles
                    ) {

                        /*
                            Example:

                            Selected:

                            MyPhotos/
                                photo1.jpg
                                photo2.jpg
                                images/
                                    beach.jpg

                            webkitRelativePath:

                            MyPhotos/photo1.jpg
                            MyPhotos/photo2.jpg
                            MyPhotos/images/beach.jpg
                        */

                        let relativePath =
                            file.webkitRelativePath;


                        /*
                            If currently inside:

                            Documents

                            folder becomes:

                            Documents/MyPhotos/photo1.jpg
                        */

                        if (currentPath) {

                            relativePath =
                                `${currentPath}/${relativePath}`;

                        }


                        const encodedPath =
                            relativePath
                                .split("/")
                                .map(
                                    (part) =>
                                        encodeURIComponent(part)
                                )
                                .join("/");


                        console.log(
                            "Uploading:",
                            relativePath
                        );


                        const response =
                            await fetch(
                                `${API}/files/${encodedPath}`,
                                {
                                    method: "POST",
                                    body: file,
                                }
                            );


                        const data =
                            await response.json();


                        if (!response.ok) {

                            alert(
                                `Failed to upload: ${relativePath}`
                            );

                            return;

                        }

                    }


                    alert(
                        "Folder uploaded successfully!"
                    );


                    getFiles();

                } catch (error) {

                    console.error(
                        "FOLDER UPLOAD ERROR:",
                        error
                    );


                    alert(
                        "Failed to upload folder"
                    );

                }

            };


        input.click();

    };


    // ========================================
    // RENAME FILE
    // ========================================

    const renameFile = async (fileName) => {

        const newName =
            window.prompt(
                "Enter new file name:",
                fileName
            );


        if (!newName) {

            return;

        }


        if (newName === fileName) {

            return;

        }


        try {

            const oldPath =
                getFilePath(fileName);


            const encodedPath =
                oldPath
                    .split("/")
                    .map(
                        (part) =>
                            encodeURIComponent(part)
                    )
                    .join("/");


            const response =
                await fetch(
                    `${API}/files/${encodedPath}`,
                    {
                        method: "PATCH",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            newName: newName,
                        }),

                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Rename failed"
                );

                return;

            }


            alert(
                data.message
            );


            getFiles();

        } catch (error) {

            console.error(
                "RENAME ERROR:",
                error
            );


            alert(
                "Failed to rename file"
            );

        }

    };


    // ========================================
    // DELETE FILE
    // ========================================

    const deleteFile = async (fileName) => {

        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${fileName}"?`
            );


        if (!confirmed) {

            return;

        }


        try {

            const filePath =
                getFilePath(fileName);


            const encodedPath =
                filePath
                    .split("/")
                    .map(
                        (part) =>
                            encodeURIComponent(part)
                    )
                    .join("/");


            const response =
                await fetch(
                    `${API}/files/${encodedPath}`,
                    {
                        method: "DELETE",
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                alert(
                    data.message ||
                    "Delete failed"
                );

                return;

            }


            alert(
                data.message
            );


            setFiles(
                (oldFiles) =>
                    oldFiles.filter(
                        (item) =>
                            item.name !== fileName
                    )
            );

        } catch (error) {

            console.error(
                "DELETE ERROR:",
                error
            );


            alert(
                "Failed to delete file"
            );

        }

    };


    // ========================================
    // LOAD DIRECTORY
    // ========================================

    useEffect(() => {

        getFiles("");

    }, []);


    // ========================================
    // UI
    // ========================================

    return (

        <div style={styles.container}>

            <div style={styles.card}>


                {/* ========================================
                    HEADER
                ======================================== */}

                <div style={styles.header}>

                    <div>

                        <h1 style={styles.title}>
                            📁 My File Manager
                        </h1>

                        <p style={styles.subtitle}>
                            Manage your files easily
                        </p>

                    </div>


                    <div
                        style={
                            styles.uploadButtons
                        }
                    >

                        <button
                            style={
                                styles.uploadButton
                            }
                            onClick={
                                uploadFile
                            }
                        >
                            + Upload File
                        </button>


                        <button
                            style={
                                styles.folderButton
                            }
                            onClick={
                                uploadFolder
                            }
                        >
                            📁 Upload Folder
                        </button>

                    </div>

                </div>


                {/* ========================================
                    NAVIGATION
                ======================================== */}

                <div
                    style={
                        styles.navigation
                    }
                >

                    <button
                        style={
                            styles.backButton
                        }
                        onClick={
                            goBack
                        }
                        disabled={
                            !currentPath
                        }
                    >
                        ← Back
                    </button>


                    <span
                        style={
                            styles.currentPath
                        }
                    >

                        📍 /

                        {currentPath}

                    </span>

                </div>


                {/* ========================================
                    FILE LIST
                ======================================== */}

                {loading ? (

                    <div
                        style={
                            styles.message
                        }
                    >
                        Loading files...
                    </div>

                ) : files.length === 0 ? (

                    <div
                        style={
                            styles.message
                        }
                    >
                        Folder is empty
                    </div>

                ) : (

                    <div>

                        {files.map(
                            (file) => (

                                <div
                                    key={
                                        file.name
                                    }
                                    style={
                                        styles.file
                                    }
                                >


                                    {/* FILE INFO */}

                                    <div
                                        style={
                                            styles.fileInfo
                                        }
                                    >

                                        <span
                                            style={
                                                styles.icon
                                            }
                                        >

                                            {
                                                file.isDirectory
                                                    ? "📂"
                                                    : "📄"
                                            }

                                        </span>


                                        <span
                                            style={
                                                styles.fileName
                                            }
                                        >

                                            {
                                                file.name
                                            }

                                        </span>

                                    </div>


                                    {/* ========================================
                                        FOLDER ACTION
                                    ======================================== */}

                                    {
                                        file.isDirectory
                                            ? (

                                                <button
                                                    style={
                                                        styles.openFolder
                                                    }
                                                    onClick={() =>
                                                        openFolder(
                                                            file.name
                                                        )
                                                    }
                                                >
                                                    Open
                                                </button>

                                            )
                                            : (

                                                /* ========================================
                                                    FILE ACTIONS
                                                ======================================== */

                                                <div
                                                    style={
                                                        styles.buttons
                                                    }
                                                >

                                                    <button
                                                        style={
                                                            styles.open
                                                        }
                                                        onClick={() =>
                                                            openFile(
                                                                file.name
                                                            )
                                                        }
                                                    >
                                                        Open
                                                    </button>


                                                    <button
                                                        style={
                                                            styles.download
                                                        }
                                                        onClick={() =>
                                                            downloadFile(
                                                                file.name
                                                            )
                                                        }
                                                    >
                                                        Download
                                                    </button>


                                                    <button
                                                        style={
                                                            styles.rename
                                                        }
                                                        onClick={() =>
                                                            renameFile(
                                                                file.name
                                                            )
                                                        }
                                                    >
                                                        Rename
                                                    </button>


                                                    <button
                                                        style={
                                                            styles.delete
                                                        }
                                                        onClick={() =>
                                                            deleteFile(
                                                                file.name
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            )
                                    }

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>

    );

}


// ========================================
// STYLES
// ========================================

const styles = {

    container: {

        minHeight: "100vh",

        background: "#f3f4f6",

        padding: "40px",

        fontFamily:
            "Arial, Helvetica, sans-serif",

    },


    card: {

        maxWidth: "1000px",

        margin: "0 auto",

        background: "#ffffff",

        padding: "30px",

        borderRadius: "16px",

        boxShadow:
            "0 10px 30px rgba(0,0,0,0.08)",

    },


    header: {

        display: "flex",

        justifyContent:
            "space-between",

        alignItems: "center",

        marginBottom: "20px",

    },


    title: {

        margin: 0,

        fontSize: "28px",

    },


    subtitle: {

        marginTop: "6px",

        color: "#777",

    },


    uploadButtons: {

        display: "flex",

        gap: "10px",

        alignItems: "center",

    },


    uploadButton: {

        border: "none",

        background: "#2563eb",

        color: "white",

        padding: "11px 18px",

        borderRadius: "8px",

        cursor: "pointer",

        fontSize: "14px",

        fontWeight: "600",

    },


    folderButton: {

        border: "none",

        background: "#16a34a",

        color: "white",

        padding: "11px 18px",

        borderRadius: "8px",

        cursor: "pointer",

        fontSize: "14px",

        fontWeight: "600",

    },


    // ========================================
    // NAVIGATION
    // ========================================

    navigation: {

        display: "flex",

        alignItems: "center",

        gap: "15px",

        marginBottom: "20px",

        padding: "12px",

        background: "#f8fafc",

        borderRadius: "8px",

    },


    backButton: {

        border: "none",

        background: "#e5e7eb",

        padding: "8px 14px",

        borderRadius: "6px",

        cursor: "pointer",

        fontWeight: "600",

    },


    currentPath: {

        color: "#555",

        fontSize: "14px",

    },


    // ========================================
    // FILE ROW
    // ========================================

    file: {

        display: "flex",

        justifyContent:
            "space-between",

        alignItems: "center",

        padding: "16px",

        marginBottom: "10px",

        border:
            "1px solid #e5e7eb",

        borderRadius: "10px",

        background: "#fafafa",

    },


    fileInfo: {

        display: "flex",

        alignItems: "center",

        gap: "10px",

        minWidth: 0,

    },


    icon: {

        fontSize: "22px",

    },


    fileName: {

        fontSize: "15px",

        fontWeight: "500",

        wordBreak: "break-all",

    },


    buttons: {

        display: "flex",

        gap: "8px",

        marginLeft: "20px",

        flexShrink: 0,

    },


    open: {

        border: "none",

        background: "#e5e7eb",

        padding: "8px 12px",

        borderRadius: "6px",

        cursor: "pointer",

    },


    openFolder: {

        border: "none",

        background: "#16a34a",

        color: "white",

        padding: "8px 12px",

        borderRadius: "6px",

        cursor: "pointer",

    },


    download: {

        border: "none",

        background: "#222",

        color: "white",

        padding: "8px 12px",

        borderRadius: "6px",

        cursor: "pointer",

    },


    rename: {

        border: "none",

        background: "#f59e0b",

        color: "white",

        padding: "8px 12px",

        borderRadius: "6px",

        cursor: "pointer",

    },


    delete: {

        border: "none",

        background: "#ef4444",

        color: "white",

        padding: "8px 12px",

        borderRadius: "6px",

        cursor: "pointer",

    },


    message: {

        textAlign: "center",

        padding: "50px",

        color: "#777",

        fontSize: "16px",

    },

};


export default App;