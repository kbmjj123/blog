/* eslint-disable */
const chalk = require('chalk');
const fs = require('fs');

const msgPath = process.argv.slice(2, 3)[0];
const msg = fs.readFileSync(msgPath, 'utf-8').trim();

const commitRE = /^([A-Za-z0-9]+-)+[A-Za-z0-9]+\s(build|chore|ci|docs|feat|fix|wip|perf|refactor|revert|style|test|temp|)(\(.+\)):\s.{1,50}/;

if (!(commitRE.test(msg) || msg.indexOf('Merge') === 0)) {
    console.error(
        `  ${chalk.bgRed.white(' ERROR ')}
  [${chalk.red(msg)}] 是 ${chalk.red('错误的提交消息格式')}
  ${chalk.red('正确的提交消息-示例:')}

  ${chalk.blue('issue-1 feat(模块): 预发布环境增加 A 模块')}
  ${chalk.blue('issue-2 fix(文案): 修复错误文案')}`
    );
    process.exit(1);
} else {
    console.log(`${chalk.green('The commit message has been verified successfully.')}`);
}