import fs from "fs";

const logs = {
  generateLogFile(location: string, content: string | Error): void {
    fs.writeFileSync(
      location,
      content instanceof Error ? JSON.stringify(content) : content
    );
  },
};

export default logs;
