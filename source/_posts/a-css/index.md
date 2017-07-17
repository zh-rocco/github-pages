---
layout: post
title: 容易忽视的 CSS
author: Simple
tags:
  - float
categories:
  - CSS
comments: true
date: 2017-05-10 18:50:00
updated: 2017-05-29 18:10:00

---

## `box-sizing`

**语法：**

`box-sizing: content-box | border-box`

- 默认值：`content-box`
- 适用于：所有接受width和height的元素
- 继承性：无

**说明：**

*content-box:* `Element width = width + border + padding`, 此属性表现为标准模式下的盒模型。

*border-box:* `Element width = width`, 此属性表现为怪异模式下的盒模型。

<!-- more -->


## line-height 设置为数字和百分比的区别

如果使用数字设定行高（**通常都这么做**），那么所有的子元素都会继承这个比例。因此，如果父元素的字体大小是 20 像素（或以 em 等表示的等价大小），
行高是 2，则该元素的行高就是 40（即 20 x 2）像素。如果子元素的字体大小是 30 像素，则该元素的行高就是 60（即 30 × 2）像素。

如果使用百分数或 em 值，那么只会继承产生的行高（即计算出来的值）。因此，如果父元素的字体大小是 20 像素，行高是 200%，
则该元素的行高就是 40 像素。所有的子元素都将继承 40 像素的行高，不管字体大小是多少。

### 在线演示

<script async src="//jsfiddle.net/singple/0wbsrxob/embed/html,css,result/"></script>


## 伪元素、伪类

在 `CSS3` 中, `:first-line` 的语法为 `::first-line`, `:first-letter` 的语法为 `::first-letter`; 注意，它们用两个冒号代替了单个冒号。

这样修改的目的是将伪元素（四个, `::first-line`, `::first-letter`, `::before` 和 `::after`）与伪类（如 `:first-child`, `:link`, `:hover` 等）区分开。

原始的单冒号语法则被废弃了，但浏览器出于向后兼容的目的，仍然支持它们。
IE9 之前的 Internet Explorer 版本均不支持双冒号。
因此，你可以选择继续使用单冒号语法，除非你为 IE8 及以下版本设置了单独的 CSS ([参考](http://reference.sitepoint.com/css/conditionalcomments))


## 会被继承的 CSS 属性

1\. 文本
- color（颜色， a 元素除外）
- direction（方向）
- font（字体）
- font-family（字体系列）
- font-size（字体大小）
- font-style（用于设置斜体）
- font-variant（用于设置小型大写字母）
- font-weight（用于设置粗体）
- letter-spacing（字母间距）
- line-height（行高）
- text-align（用于设置对齐方式）
- text-indent（用于设置首行缩进）
- text-transform（用于修改大小写）
- visibility（可见性）
- white-space（用于指定如何处理空格）
- word-spacing（字间距）

2\. 列表
- list-style（列表样式）
- list-style-image（用于为列表指定定制的标记）
- list-style-position（用于确定列表标记的位置）
- list-style-type（用于设置列表的标记）

3\. 表格
- border-collapse（用于控制表格相邻单元格的边框是否合并为单一边框）
- border-spacing（用于指定表格边框之间的空隙大小）
- caption-side（用于设置表格标题的位置）
- empty-cells（用于设置是否显示表格中的空单元格）

4\. 页面设置（对于印刷物）
- orphans（用于设置当元素内部发生分页时在页面底部需要保留的最少行数）
- page-break-inside（用于设置元素内部的分页方式）
- widows（用于设置当元素内部发生分页时在页面顶部需要保留的最少行数）

5\. 其他
- cursor（鼠标指针）
- quotes（用于指定引号样式）

**注意：**

虽然 `font-family` 属性是继承的，但有几个元素不会继承父元素的字体设置，
其中有表单的 `select`, `textarea` 和 `input` 元素。
不过，可以强制它们继承父元素的字体设置，代码为：

``` css
input, select, textarea {
  font-family: inherit;
}
```

## 表单相关

[The Current State of HTML5 Forms](www.wufoo.com/html5)

### 属性值：

- `accept:`  限制用户可上传文件的类型；
- `autocomplete:`  如果对 `form` 元素或特定的字段添加 `autocomplete="off"`，就会关闭浏览器的对该表单或该字段的自动填写功能，默认值为 `on`；
- `autofocus:`  页面加载后将焦点放到该字段；
- `multiple:`  允许输入多个电子邮件地址，或者上传多个文件；
- `list:`  将 `datalist` 与 `input` 联系起来
- `maxlength:`  指定 `textarea` 的最大字符数（在 HTML5 之前的文本框就支持该特性）；
- `pattern:`  定义一个用户所输入的文本在提交之前必须遵循的模式；
- `placeholder:`  指定一个出现在文本框中的提示文本，用户开始输入后该文本消失；
- `required:`  需要访问者在提交表单之前必须完成该字段；
- `formnovalidate:`  关闭 `HTML5` 的自动验证功能，应用于提交按钮；
- `novalidate:`  关闭 `HTML5` 的自动验证功能，应用于表单元素；
- `lable:`  每个 `label` 的 `for` 属性与该标签对应的表单字段的 `id` 是匹配的，这样可以将该标签与该字段显式关联起来；
还可以将一个表单字段放在一个包含标签文本的 label 内，例如， `<label>FirstName: <input type="text" name="first_name" /></label>`。
（注意在这种情况下，就不需要使用 `for` 和 `id` 了。）
不过，将标签与字段分开是更常见的做法，原因之一是这样更容易添加样式。

### `type` 类型：

#### `type="radio"`

同一组单选按钮的 `name` 属性值必须相同，这样在同一时间只有其中一个能被选中。`value` 属性也很重要，因为对于单选按钮访问者无法输入值。

#### `type="select"`

``` html
<label for="state">State:</label>
<select id="state" name="state">
  <option value="AL">Alabama</option>
  <option value="AK">Alaska</option>
  ...
</select>
```

选择框由两种 HTML 元素构成：`select` 和 `option`。
通常，在 `select` 元素里 置 `name` 属性，在每个 `option` 元素里设置 `value` 属性。
我们可以为 `select` 和 `option` 元素添加样式，但有一定的限制。

如果需要，输入 `size="n"`，这里的 `n` 代表选择框的高度（以行为单位）。
如果添加了 `size` 属性，那么选择框看起来会更像一个列表，且没有自动选中的选项（除非设置了 selected）。

如果 `size` 大于选项的数量，访问者就可以通过点击空白区域让所有的选项处于未选中状态。

`option:` 输入 `value="optiondata"`， 这里的 `optiondata` 是选项选中后要发送给服务器的数据（如果省略 `value`，你在 `option` 标签中输入的文本就是选项的值）。

#### `type="email"` 和 `type="URL"`

`HTML5` 对 `type="email"` 和 `type="URL"` 的 `input` 添加了自动验证功能。对提交按钮使用 `formnovalidate` 属性可以关闭该功能，如 `<input type="submit" formnovalidate />`。


### `textarea`

如果没有使用 `maxlength` 属性限制文本区域的最大字符数量，访问者可以输入多达 32700 个字符。访问者可以通过拖曳文本区域右下角的斜线改变文本区域的大小。如果设置了 `textarea { resize: none; }`，那么访问者就无法这样操作了。


### 根据状态为表单设置样式

**伪类：**
- :focus    获得焦点的字段 IE8+ 及其他
- :checked    选中的单选按钮或复选框 IE9+ 及其他
- :disabled    具有 disabled 属性的字段 IE9+ 及其他
- :enable    与 :disabled 相反 IE9+ 及其他
- :required    具有 required 属性的字段 IE10+、 Safari 5+ 及其他
- :optional    与 :required 相反 IE10+、 Safari 5+ 及其他
- :invalid    其值与 pattern 属性给出的模式不匹配的字段；或值不是有效电子邮件格式的电子邮件框，值不是有效 URL 格式的 URL 框，以及任何标记为 required 但值为空的字段 IE10+、 Safari 5+ 及其他
- :valid    与 :invalid 相反 IE10+、 Safari 5+ 及其他


## `z-index`

`z-index` 属性仅对定位过的元素（即设为绝对定位、相对定位或固定定位的元素）有效。

同级下，对于定位元素，`z-index` 最高的数显示在最上面。


## table 相关

1. 如果包含了 caption 元素，那么它必须是 table 中的第一个元素，（caption元素可以包含 p 和其他文本元素）
2. 如果包含了 thead 或 tfoot，则必须包含 tbody。 tbody 不能位于 thead 之前。一个 table 只能拥有一个 thead 和一个 tfoot，但可以有多个 tbody 元素。
3. 如果 table 是嵌套在 figure 元素内除 figcaption 以外的唯一元素，则可以省略caption，使用 figcaption 对表格进行描述。
注意，不要在 table 中嵌套figcaption，而应跟往常一样将 figcaption放在 figure 中。

## text-* 属性

### text-align

快级元素才可以设置 `text-align`，行间元素（`inline`）设置 `text-align` 无效。

### text-indent

快级元素才可以设置 `text-indent`，行间元素（`inline`）设置 `text-indent` 无效。

### text-transform

``` css
// 单词的首字母大写
text-transform: capitalize;

// 所有字母大写
text-transform: uppercase;

// 所有字母小写
text-transform: lowercase;

// 让文本保持本来的样子（可以用来取消继承的 text-transform 值）
text-transform: none;
```

**类似属性：**

``` css
// 使用小型大写字母
font-variant: small-caps;
```


