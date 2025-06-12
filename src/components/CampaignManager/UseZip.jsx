import { useState } from "react";
import JSZip from "jszip";

function useZip() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reading a zip file, return array of files in the zip
  const readZip = async (zipFile) => {
    try {
      setIsLoading(true);
      setError(null);

      const zip = new JSZip();
      const zipContent = await zip.loadAsync(zipFile);

      const files = {};
      zipContent.forEach((relativePath, file) => {
        files[relativePath] = file;
      });

      setIsLoading(false);
      return files;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  // Reading a specific file from a zip
  const readFileFromZip = async (zipFile, filePath) => {
    try {
      setIsLoading(true);
      setError(null);

      const zip = new JSZip();
      const zipContent = await zip.loadAsync(zipFile);

      // Check if the file exists in the zip
      if (!zipContent.files[filePath]) {
        throw new Error(`File '${filePath}' not found in the zip archive`);
      }

      // Get the file from the zip
      const file = zipContent.files[filePath];

      // Read the file content based on its type
      let content;
      if (file.dir) {
        throw new Error(`'${filePath}' is a directory, not a file`);
      }

      // Determine content type and read accordingly
      const fileExtension = filePath.split(".").pop().toLowerCase();
      const isText = /^(txt|json|xml|html|css|js|jsx|md|csv|yml|yaml)$/i.test(
        fileExtension
      );

      if (isText) {
        content = await file.async("string");
        // Try to parse JSON if it's a JSON file
        if (fileExtension === "json") {
          try {
            content = JSON.parse(content);
          } catch (e) {
            // If parsing fails, return the raw string
            console.warn("Failed to parse JSON file:", e);
          }
        }
      } else {
        // Return as blob for binary files
        content = await file.async("blob");
      }

      setIsLoading(false);
      return content;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  // Create a zip file, return a blob
  const createZip = async (files, options = { type: "blob" }) => {
    try {
      setIsLoading(true);
      setError(null);

      const zip = new JSZip();

      // Add files to the zip
      if (files) {
        Object.entries(files).forEach(([path, content]) => {
          // Check if this is a directory entry (ends with '/')
          if (path.endsWith("/")) {
            // Create an empty folder
            zip.folder(path.slice(0, -1)); // Remove trailing slash
          } else {
            const pathParts = path.split("/");

            if (pathParts.length > 1) {
              // It's a nested file
              let folder = zip;
              for (let i = 0; i < pathParts.length - 1; i++) {
                folder = folder.folder(pathParts[i]);
              }
              folder.file(pathParts[pathParts.length - 1], content);
            } else {
              // It's a root file
              zip.file(path, content);
            }
          }
        });
      } else {
        // Example content if no files provided
        zip.file("hello.txt", "Hello World!");
        zip.folder("nested").file("nested.txt", "Nested content");
      }

      // Generate the zip file with provided options
      const blob = await zip.generateAsync(options);

      setIsLoading(false);
      return blob;
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
      throw err;
    }
  };

  return { readZip, createZip, readFileFromZip, isLoading, error };
}

export default useZip;
