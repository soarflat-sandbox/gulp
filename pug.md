# Pug

Pugのメモ。

## Mixins

再利用可能なブロックを生成できる機能（関数みたいなもの）。

```pug
//- Declaration
mixin list
  ul
    li foo
    li bar
    li baz
//- Use
+list
+list
```

↓

```html
<ul>
  <li>foo</li>
  <li>bar</li>
  <li>baz</li>
</ul>
<ul>
  <li>foo</li>
  <li>bar</li>
  <li>baz</li>
</ul>
```

Mixinには引数を渡せる。

```pug
mixin pet(name)
  li.pet= name
ul
  +pet('cat')
  +pet('dog')
  +pet('pig')
```

↓

```html
<ul>
  <li class="pet">cat</li>
  <li class="pet">dog</li>
  <li class="pet">pig</li>
</ul>
```

### Mixin Blocks

Pugのブロックをコンテンツとして利用できる。

```pug
mixin article(title)
  .article
    .article-wrapper
      h1= title
      if block
        block
      else
        p No content provided
​
+article('Hello world')
​
+article('Hello world')
  p This is my
  p Amazing article
```

↓

```html
<div class="article">
  <div class="article-wrapper">
    <h1>Hello world</h1>
    <p>No content provided</p>
  </div>
</div>
<div class="article">
  <div class="article-wrapper">
    <h1>Hello world</h1>
    <p>This is my</p>
    <p>Amazing article</p>
  </div>
</div>
```

`if block content`のようにブロックの名前を指定することはできない。

### Mixin Attributes

以下の記法で暗黙の属性引数を渡せる。

```pug
mixin link(href, name)
  //- ↓は暗黙の属性引数
  //- attributes == {class: "btn"}
  a(class!=attributes.class href=href)= name

+link('/foo', 'foo')(class="btn")
```

↓

```html
<a class="btn" href="/foo">foo</a>
```

渡した属性はエスケープされるのでエスケープを防ぐには`!=`を利用する（https://pugjs.org/language/attributes.html#unescaped-attributes）。


`&attributes`を利用すれば、より短く書ける。

```pug
mixin link(href, name)
  a(href=href)&attributes(attributes)= name

+link('/foo', 'foo')(id="btn", class="btn")
```

↓

```html
<a class="btn" href="/foo" id="btn">foo</a>
```

属性引数だけ渡すには、`+link(class="btn")`で書ける（`+link()(class="btn")`でもOK）。

### Default Argument’s Values

デフォルト引数を指定できる。

```pug
mixin article(title='Default Title')
  .article
    .article-wrapper
      h1= title
+article()
+article('Hello world')
```

↓

```html
<div class="article">
  <div class="article-wrapper">
    <h1>Default Title</h1>
  </div>
</div>
<div class="article">
  <div class="article-wrapper">
    <h1>Hello world</h1>
  </div>
</div>
```

### Rest Arguments

可変長引数を指定できる。

```pug
mixin list(id, ...items)
  ul(id=id)
    each item in items
      li= item

+list('my-list', 1, 2, 3, 4)
```

↓

```html
<ul id="my-list">
  <li>1</li>
  <li>2</li>
  <li>3</li>
  <li>4</li>
</ul>
```

## コンポーネント（インクルード）の再利用性を高めるために覚えた方が良さげな書き方

### ボタンのような単純なコンポーネント

```pug
mixin button(text)
  button&attributes(attributes)= text

+button('登録')(type="submit")
+button('戻る')()
```

↓

```html
<button type="submit">登録</button>
<button>戻る</button>
```

### 要素の数だけループで描画するリストのようなコンポーネント

#### 配列

```pug
mixin list(items)
  ul
    each item in items
      li= item

-
  items = [
    'text1',
    'text2',
    'text3'
  ]
+list(items)
```

↓

```html
<ul>
  <li>text1</li>
  <li>text2</li>
  <li>text3</li>
</ul>
```

#### 連想配列

```pug
-
  var obj = {
    title : 'hoge',
    description : 'fugafuga.',
    img : './hoge.jpg',
    date : '2017/12/8'
  }

ul
  each val, key in obj
    li(class=key) #{val}
```

↓

```html
<ul>
  <li class="title">hoge</li>
  <li class="description">fugafuga.</li>
  <li class="img">./hoge.jpg</li>
  <li class="date">2017/12/8</li>
</ul>
```

#### 連想配列 in 配列

```pug
mixin list(items)
  ul
    each item in items
      li
        p #{item.date}
        p #{item.title}

-
  items = [
    {
      date: '2019/07/26',
      title: 'title1'
    },
    {
      date: '2019/07/26',
      title: 'title1'
    }
  ]
+list(items)
```

↓

```html
<ul>
  <li>
    <p>2019/07/26</p>
    <p>title1</p>
  </li>
  <li>
    <p>2019/07/26</p>
    <p>title1</p>
  </li>
</ul>
```

条件分岐も利用できる。

```pug
mixin list(items)
  ul
    each item in items
      li
        if item.date
          p #{item.date}
        p #{item.title}

-
  items = [
    {
      title: 'title1'
    },
    {
      date: '2019/07/26',
      title: 'title1'
    }
  ]
+list(items)
```

↓

```html
<ul>
  <li>
    <p>title1</p>
  </li>
  <li>
    <p>2019/07/26</p>
    <p>title1</p>
  </li>
</ul>
```
