const { spawnSync } = require("child_process");
const spawnOptions = { detached: false, shell: true, stdio: "inherit" };

/**
 * @namespace Builder
 * @description - Builds React & Python builds of project so Electron can be used.
 */
class Builder {
    /**
     * @description - Creates React and Python production builds.
     * @memberof Builder
     */
    buildAll = () => {
        const { buildPython, buildReact } = this;

        buildPython();
        buildReact();
    };

    /**
     * @description - Creates production build of Python back end.
     * @memberof Builder
     */
    buildPython = () => {
        console.log("Creating Python distribution files...");
        spawnSync(`cd ./backend && pyinstaller main.spec --clean`, spawnOptions);
    };

    /**
     * @description - Creates production build of React front end.
     * @memberof Builder
     */
    buildReact = () => {
        console.log("Creating React distribution files...");
        spawnSync(`react-scripts build`, spawnOptions);
    };
}

module.exports.Builder = Builder;
