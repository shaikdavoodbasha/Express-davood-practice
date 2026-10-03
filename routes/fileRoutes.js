
import path from "node:path";
import express from 'express';

import {
    
    rm,
    rename,
    mkdir
} from "node:fs/promises";
import { createWriteStream } from "node:fs";



const router = express.Router();

const publicDir = path.join(
    import.meta.dirname,
    "..",
    "public"
);

router.post(
    "/{*filename}",
    async (req, res) => {

        try {

            let relativePath =
                req.params.filename;


            // Express 5 wildcard can return array
            if (Array.isArray(relativePath)) {

                relativePath =
                    relativePath.join("/");

            }


            console.log(
                "Uploading:",
                relativePath
            );


            const filepath = path.join(
                publicDir,
                relativePath
            );


            // Create folders automatically
            await mkdir(
                path.dirname(filepath),
                {
                    recursive: true
                }
            );


            const writestream =
                createWriteStream(filepath);


            req.pipe(writestream);


            writestream.on(
                "finish",
                () => {

                    console.log(
                        "Upload completed:",
                        relativePath
                    );

                    res.json({
                        message:
                            "File uploaded successfully"
                    });

                }
            );


            writestream.on(
                "error",
                (error) => {

                    console.log(
                        "WRITE ERROR:",
                        error
                    );

                    if (!res.headersSent) {

                        res.status(500).json({
                            message:
                                "Upload failed"
                        });

                    }

                }
            );

        } catch (error) {

            console.log(
                "UPLOAD ERROR:",
                error
            );

            res.status(500).json({
                message: "Upload failed"
            });

        }

    }
);


router.get(
    "/{*filename}",
    (req, res) => {

        let relativePath =
            req.params.filename;


        // Express 5 wildcard can return array
        if (Array.isArray(relativePath)) {

            relativePath =
                relativePath.join("/");

        }


        console.log(
            "Opening:",
            relativePath
        );


        const filepath = path.join(
            publicDir,
            relativePath
        );


        // Download
        if (
            req.query.action ===
            "download"
        ) {

            res.set(
                "Content-Disposition",
                "attachment"
            );

        }


        res.sendFile(
            filepath,
            (error) => {

                if (error) {

                    console.log(
                        "SEND FILE ERROR:",
                        error
                    );

                    if (!res.headersSent) {

                        res.status(404).json({
                            message:
                                "File not found"
                        });

                    }

                }

            }
        );

    }
);


// ========================================
// DELETE FILE
// ========================================

router.delete(
    "/{*filename}",
    async (req, res) => {

        try {

            let relativePath =
                req.params.filename;


            if (Array.isArray(relativePath)) {

                relativePath =
                    relativePath.join("/");

            }


            const filepath = path.join(
                publicDir,
                relativePath
            );


            console.log(
                "Deleting:",
                filepath
            );


            await rm(filepath);


            res.json({
                message:
                    "File deleted successfully"
            });

        } catch (error) {

            console.log(
                "DELETE ERROR:",
                error
            );

            res.status(404).json({
                message:
                    "File not found"
            });

        }

    }
);


// ========================================
// RENAME FILE
// ========================================

router.patch(
    "/{*filename}",
    async (req, res) => {

        try {

            let relativePath =
                req.params.filename;


            if (Array.isArray(relativePath)) {

                relativePath =
                    relativePath.join("/");

            }


            const { newName } =
                req.body;


            console.log(
                "Old filename:",
                relativePath
            );

            console.log(
                "New filename:",
                newName
            );


            if (!newName) {

                return res.status(400).json({
                    message:
                        "New filename is required"
                });

            }


            const oldPath = path.join(
                publicDir,
                relativePath
            );


            const newPath = path.join(
                path.dirname(oldPath),
                newName
            );


            await rename(
                oldPath,
                newPath
            );


            res.json({
                message:
                    "File renamed successfully"
            });

        } catch (error) {

            console.log(
                "RENAME ERROR:",
                error
            );

            res.status(404).json({
                message:
                    "File not found"
            });

        }

    }
);


export default router;