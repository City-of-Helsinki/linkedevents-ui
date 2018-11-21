const path = require('path');
const ROOT = path.resolve(__dirname, '../..');
const SRC = path.resolve(ROOT, 'src');

const common = {
    paths: {
        ROOT,
        SRC,
    },
}

module.exports = common
