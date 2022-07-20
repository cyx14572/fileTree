const fs = require('fs');
const path = require('path');

/**解析路径 */
let basepath = './src';
/**生成文件路径 */
let generatePath = './fileTree.md';
/**要包含的文件 */
let include = ['pages', 'components'];
/**要读取的文件类型 */
let fileType = ['ts', 'js', 'jsx', 'tsx'];
/**读取的注释类型 */
let annotationType = ['component', 'util'];

//获取入参
let args = process.argv.slice(2);
if (args[0] && (args[0] === '-h' || args[0] === '-help')) {
  console.log('node fileTree.js [参数1] [参数2] [参数3] [参数4]');
  console.log('参数说明');
  console.log("参数1：解析目录路径,默认为'./src'");
  console.log("参数2：生成文件路径,使用','隔开,支持正则表达式,默认为'pages', 'components'");
  console.log("参数3：生成文件路径,默认为'./fileTree.md'");
  console.log("参数4：要读取的注释类型使用','隔开,默认为'component', 'util'");

  console.log("参数按顺序读取,不能省略,使用默认值需要输入' '占位,如下:");
  console.log("node getFileTree.js [参数1] ' ' [参数3] [参数4]");
  process.exit();
}

if (args[0] && args[0] !== ' ') {
  basepath = args[0]; //解析目录路径
}
if (args[1] && args[1] !== ' ') {
  include = args[1].split(','); //包含文件名，使用，隔开
}
if (args[2] && args[2] !== ' ') {
  generatePath = args[2]; //生成文件路径
}
if (args[3] && args[3] !== ' ') {
  annotationType = args[3].split(','); //包含文件名，使用，隔开
}

/**是否是忽略文件 */
function isFilterPath(item) {
  const filterFile = include;
  for (let i = 0; i < filterFile.length; i++) {
    let reg = filterFile[i];
    if (item.match(reg) && item.match(reg)[0] === item) return true;
  }
  return false;
}

/**
 * 获取文件注释
 * @param {*} dirPath 文件路径
 */
const getFileAnnotation = (dirPath) => {
  if (!fileType.some((item) => dirPath.indexOf(item) > -1)) return '';
  let str = fs.readFileSync(dirPath).toString();
  let target = annotationType.find((item) => {
    return str.indexOf(`@${item}`) !== -1;
  });
  if (!target) return '';
  return '#' + str.split(`@${target}`)[1].split('\n')[0] + ' -' + target[0];
};

/**
 * 生成目录树只收集有注释的文件
 * @param {string} dirPath 当前路径
 * @param {arr} dirTree 目录树
 * @param {number} floor 深度
 *
 */
const deepReddir = (dirPath, dirTree, floor = 1) => {
  let initLength = dirTree.length;
  let files = fs.readdirSync(dirPath);
  if (floor === 1) {
    files = files.filter(isFilterPath);
  }
  files.forEach((itemPath) => {
    /**文件的完成路径 */
    let fullPath = path.join(dirPath, itemPath);
    const fileStat = fs.statSync(fullPath);
    /**是否是文件 */
    const isFile = fileStat.isFile();
    const dir = {
      name: itemPath,
      commit: '',
    };
    if (!isFile) {
      let children = deepReddir(fullPath, [], floor + 1);
      if (children) {
        dir.children = children;
        dir.isFile = false;
        dir.floor = floor;
        dirTree.push(dir);
      }
    } else {
      dir.commit = getFileAnnotation(fullPath);
      if (dir.commit) {
        dirTree.push(dir);
        dir.isFile = true;
        dir.floor = floor;
      } else {
        isDiscard = true;
      }
    }
  });

  // 如果长度没增加就废弃这条路径
  return initLength === dirTree.length ? false : dirTree;
};

/**目录树字符串 */
let fileTree = '```bash\n';

/**
 * 输出目录树
 * @param {*} tree
 * @param {*} floor
 * @param {*} str
 * @param {*} adder
 * @param {*} isLast
 */
function outputTree(tree, floor = 1, str = '', isLast = false, blank = '') {
  for (let i = 0; i < tree.length; i++) {
    if (floor === 1 && i === 0) {
      fileTree += '\n' + '┌─' + str + tree[i].name;
    } else if (i === tree.length - 1 && !tree[i].children) {
      fileTree += '\n' + blank + '└─ ' + str + tree[i].name + ' ' + tree[i].commit;
    } else {
      fileTree += '\n' + blank + '├─ ' + str + tree[i].name + ' ' + tree[i].commit;
    }

    if (tree[i].children)
      outputTree(
        tree[i].children,
        floor + 1,
        str,
        (isLast || floor === 1) && i === tree.length - 1,
        blank + '| ',
      );
  }
}

/**清空文件 */
function clearTxt(filePath) {
  fileTree = '';
  fs.writeFileSync(filePath, '');
}

/**写入文件 */
function writeTree(filePath, content) {
  clearTxt(generatePath);
  fs.writeFileSync(filePath, `${content}`);
}

/**目录树 */
let dirTree = [];
dirTree = deepReddir('./src', dirTree);
outputTree(dirTree);
writeTree(generatePath, fileTree + '\n ```');
console.log('生成结束');
