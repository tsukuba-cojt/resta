import {notification} from "antd";
import {useEffect} from "react";
import {downloadFormat, enableRestaDownloadStyleButton} from "../../features/upload_import_manager";

const StyleDownloader = () => {
    const [api, contextHolder] = notification.useNotification();

    useEffect(() => {
        enableRestaDownloadStyleButton(() => {
            (async () => {
                await downloadFormat();
                api.info({
                    message: "",
                    description: "",
                    placement: "bottomRight",
                });
            }) ();
        });
    }, []);

    return contextHolder;
}

export default StyleDownloader;