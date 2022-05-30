import fs from "fs";
const logs = {
    generateLogFile(location, content) {
        fs.writeFileSync(location, content instanceof Error ? JSON.stringify(content) : content);
    },
};
export default logs;
