import React, { useEffect, useRef, useState } from "react";

const MultipleFileUploader = () => {
    return (
        <div className="container">
            <div className="left_container">
                <NavigationBar />
            </div>
            <div className="right_container">
                <FileUploader />
            </div>
        </div>
    );
};
const NavigationBar = () => {
    const navItems = [
        "Home",
        "Tasks",
        "Users",
        "Apis",
        "Subscriptions",
        "Settings",
        "Helf & Support",
    ];
    return (
        <nav className="nav">
            <div className="search">
                <input type="text" name="search" placeholder="Search..." />
            </div>
            {navItems?.map((items, index) => (
                <ul className="nav_items">
                    <li>{items}</li>
                </ul>
            ))}
        </nav>
    );
};

const FILE_ICONS = [{ type: 'pdf', icon: 'picture_as_pdf' }, { type: 'png', icon: 'file_png' }, { type: 'jpeg', icon: 'gradient' }, { type: 'jpg', icon: 'image' }];



const FileUploader = () => {
    const btnRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const [files, setFiles] = useState([]);
    const [shouldShowProgressBar, setShouldShowProgressBar] = useState(false);
    // One controller for the component's lifetime, so a re-render doesn't swap it out mid-upload.
    const controllerRef = useRef(new AbortController());

    const allowed = ["application/pdf", "image/png", "image/jpeg"];
    const MAX = 5 * 1024 * 1024;

    const handleFiles = (fileList) => {
        const incoming = Array.from(fileList)
            .filter((f) => allowed.includes(f.type) && f.size <= MAX)
            .map((file) => ({
                file,
                preview: file.type.startsWith("image/")
                    ? URL.createObjectURL(file)
                    : null, // no preview for PDFs
            }));
        setFiles((prev) => [...prev, ...incoming]);
    };

    const removeFile = (index) => {
        setFiles((prev) => {
            if (prev[index].preview) URL.revokeObjectURL(prev[index].preview);
            return prev.filter((_, i) => i !== index);
        });
    };

    // Revoke all URLs when the component unmounts
    const filesRef = useRef(files);
    filesRef.current = files;
    useEffect(() => {
        return () => {
            filesRef.current.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
        };
    }, []);

    const onProgress = (progress, file) => {
        setFiles((prev) =>
            prev.map((item) =>
                item.file === file ? { ...item, progress, success: progress >= 100 } : item
            )
        );
    };
    console.log("files", files)
    const uploadFile = (file, onProgress, signal) => {

        return new Promise((resolve, reject) => {
            let progress = 0;

            const interval = setInterval(() => {
                if (signal.aborted) {
                    clearInterval(interval);
                    reject(new Error("Upload cancelled"));
                    return;
                }
                setShouldShowProgressBar(true);
                progress += 10;

                onProgress(progress, file);

                if (progress >= 100) {
                    clearInterval(interval);
                    setShouldShowProgressBar(false);
                    resolve({
                        success: true,
                        fileName: file.name
                    });
                }
            }, 300);
        });
    };
    return (
        <section>
            <div
                id="drop-zone"
                className={dragging ? "dragover" : ""}
                onClick={() => btnRef.current.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    handleFiles(e.dataTransfer.files);
                }}
                onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        btnRef.current.click();
                    }
                }}
                role="button"
                tabIndex={0}
            >
                <p><span className="browse">Click here</span> to upload your file or drag</p>
                <p>Supported format PDF, PNG, JPG, JPEG (5MB each).</p>
                <input
                    type="file"
                    multiple
                    hidden
                    accept=".pdf,.png,.jpg,.jpeg"
                    ref={btnRef}
                    onChange={(e) => {
                        handleFiles(e.target.files);
                        e.target.value = "";
                    }}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>

            <ul className="file-list" id="file-list">
                {files.map(({ file, preview, progress = 0, success }, i) => {

                    const fileType = file?.type?.split('/')[1];
                    const matchedIcon = FILE_ICONS.find((item) => item.type === fileType)?.icon ?? '';
                    return <li key={`${file.name}-${file.lastModified}-${i}`}>
                        
                        <div className="upload">
                            {preview ? (
                                <img src={preview} alt={file.name} className="thumb" />
                            ) : null}

                            <div className="info">
                                <div><span className="material-symbols-outlined">{matchedIcon}</span></div>
                                <div>{file.name}</div>
                                <div>{(file.size / 1024).toFixed(1)} KB</div>
                            </div>

                            <button type="button" onClick={() => removeFile(i)}>✕</button>
                             {!success && <button type="button" onClick={() => uploadFile(file, onProgress, controllerRef.current.signal)}><span class="material-symbols-outlined">
                                upload_file
                            </span></button>}
                            <div>{success ? <span class="material-symbols-outlined">
                            task_alt
                        </span> : ''}</div>
                        </div>
                        {progress >0 && progress!==100  ? <div className="progress">
                            <div className="bar" style={{ width: `${progress}%` }}></div>
                        </div> : null}
                    </li>
                }
                )}
            </ul>
        </section>
    );
};





export default MultipleFileUploader;
