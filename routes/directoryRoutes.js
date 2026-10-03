import path from "node:path";
import express from "express";

import {
    readdir,
    stat,
} from "node:fs/promises";

const router = express.Router();

const publicDir = path.join(
    import.meta.dirname,
    "..",
    "public"
);

router.get("/", async (req, res) => {

    try {

        const requestedPath =
            req.query.path || "";

        const directoryPath = path.join(
            publicDir,
            requestedPath
        );

        console.log(
            "Reading directory:",
            directoryPath
        );

        const filelist =
            await readdir(directoryPath);

        const data = [];

        for (const item of filelist) {

            const fullPath = path.join(
                directoryPath,
                item
            );

            const stats =
                await stat(fullPath);

            data.push({
                name: item,
                isDirectory: stats.isDirectory()
            });

        }

        console.log(
            "DIRECTORY:",
            requestedPath || "/",
            data
        );

        res.json(data);

    } catch (error) {

        console.log(
            "DIRECTORY ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to load directory"
        });

    }

});

export default router;