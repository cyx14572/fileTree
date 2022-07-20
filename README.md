# fileTree功能介绍
- 该脚本目前只支持输出带注释的文件（注释写法看使用帮助）
- 生成的的注释后面的 -c是表示注释类型（c为注释类型首字母）
- 目前只支持'ts', 'js', 'jsx', 'tsx'
```bash

┌─components
| ├─ AuthComponents
| | ├─ AuthButton.tsx # 权限按钮组件 -c
| | ├─ AuthContainer.tsx # 自定义权限按钮并支持二次确认弹窗 -c
| | ├─ AuthLink.tsx # 为表格便捷操作的权限text组件（只有拥有权限才能触发text点击事件） -c
| | └─ AuthMenuItem.tsx # 权限菜单按钮 -c
| ├─ Authorized
| | ├─ Authorized.tsx # 权限校验容器组件 -c
| | ├─ CheckPermissions.tsx # 通用权限检查方法 -u
| | ├─ PromiseRender.jsx # 异步权限校验组件 -c
| | ├─ Secured.jsx # 用于判断是否拥有权限访问此 view 权限 -u
| | └─ renderAuthorize.ts # 更新权限方法 -u
| ├─ CustomSelectors
| | ├─ TagSelector.tsx # 标签选择器 -c
| | ├─ ThemeSelect.tsx # 主题选择组件 -c
| | └─ index.tsx # 导出ThemeSelect、TagSelector 组件 -u
| ├─ ProTable
| | └─ index.tsx # ProTable 基于ProTable二次封装表格组件 -c
```


### 使用方法
查看使用帮助
```
node fileTree.js -h
```
执行脚本
```
node fileTree.js [参数1] [参数2] [参数3] [参数4]
```

### 参数说明
目前只有四个参数参数按顺序读取,不能省略,使用默认值需要输入' '占位,如下:node getFileTree.js [参数1] ' ' [参数3] [参数4]

- 参数1: 解析目录路径,默认为'./src
- 参数2：生成文件路径,使用','隔开,支持正则表达式,默认为'pages', 'components'
- 参数3：生成文件路径,默认为'./fileTree.md'
- 参数4：要读取的注释类型使用','隔开,默认为'component', 'util'

### 使用帮助
> 文件中的注释写法必须是下面这种格式才能读取,注释中`@`后面的名称可以自定义但是不能是注释规范中的单词，
> 定义的单词首字母会在文件树的注释中体现如'-c'，
> 为了文件树更加简洁脚本自动过滤的没有写注释的文件 。
```js

/**
 * @component 权限按钮组件 <-脚本中会读取该行的注释
 * @props {string} auth 权限名
 * @props {string} env 环境 dev prod test
 * @props {boolean} needPopconfirm 需要Popconfirm二次确认
 *
 */
const AuthButton = (props: IProps) => {
...
}
```
