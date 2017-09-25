---
layout: post
title: Route
author: Simple
tags:
  - route
categories:
  - Angular
comments: true
date: 2017-09-22 20:30:00

---

## Routes 对象
``` typescript
const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'folder', component: FolderComponent},
  {path: '**', component: Code404Component}
];
```

**说明:**

1. 当用户访问根目录时会被重定向至 `/home` 页面;
2. 通配符路由 `{path: '**', component: Code404Component}`, 页面不存在时跳转至 `Code404Component` 组件, 放在路由对象数组的最后面;


## routeLink 指令
1. template 内 `[routeLink]` 的参数是一个数组, 例如 `<a [routeLink]="['/']">Home</a>`;


## Router 对象
``` typescript
constructor(
  private router: Router
) {}

clickRoute() {
  // 导航至根目录
  this.router.navigate(['/folder']);
}
```


## 路由时传递数据

### 在查询参数中传递数据
#### 传入数据
``` html
<a [routeLink]="['/folder']" [queryParams]="{id: '1'}">Folder</a>
```
点击 "Folder" 链接时, 页面 URL 中会显示 "查询参数", 如: `/folder?id=1`;

#### 获取数据
``` typescript
// 文件夹 id
private folderId: string;

constructor(
  private routeInfo: ActivateRoute
) {}

ngOnInit() {
  this.folderId = this.routeInfo.snapshot.queryParams['id'];
}
```

### 在路由路径中传递数据
#### 修改 routes 对象
``` typescript
const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'folder/:id', component: FolderComponent},
  {path: '**', component: Code404Component},
];
```

#### 传入数据
``` html
<a [routeLink]="['/folder', '1']">Folder</a>
```
点击 "Folder" 链接时, 页面 URL 为: `/folder/1`;

#### 获取数据
``` typescript
// 文件夹 id
private folderId: string;

constructor(
  private routeInfo: ActivateRoute
) {}

ngOnInit() {
  // 参数快照(只会在组件创建时赋值一次)
  this.folderId = this.routeInfo.snapshot.params['id'];

  // 参数订阅(路由变化就会触发赋值)
  this.routeInfo.params.subscribe((params: Params) => this.folderId = params['id']);
}
```

### 在路由配置中传递数据
#### 传入数据
``` typescript
constructor(
  private router: Router
) {}

clickRoute() {
  // 导航至根目录
  this.router.navigate(['/folder', '1']);
}
```
触发 `clickRoute` 函数后, 页面 URL 为: `/folder/1`


## 子路由

### routes 配置
``` typescript
const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {path: 'profile', component: profileComponent},
      {path: 'setting', component: SettingComponent}
    ]
  }
];
```

### routerLink
1. routerLink 要用相对路径 `./`, 如: `<a [routeLink]="['./setting']">Home</a>`;


## 辅助路由

### outlet
``` html
<router-outlet></router-outlet>
<!-- 命名辅助路由 -->
<router-outlet name="aux"></router-outlet>
```

### routes
``` typescript
{path: 'path1', component: Component1, outlet: 'aux'},
{path: 'path2', component: Component2, outlet: 'aux'}
```

### routerLink
``` html
<a [routeLink]="['/home', {outlets: {aux: 'path1'}}]">path1</a>
<a [routeLink]="['/folder', {outlets: {aux: 'path2'}}]">path2</a>
```

### 说明
1. `<router-outlet></router-outlet>` 主插槽会显示 `home` 对应的组件, 同时 `<router-outlet name="aux"></router-outlet>` 插槽会显示 `path1` 对应的组件;


## 路由守卫(路由钩子)

### 常用类型
1. CanActivate: 处理导航到某路由的情况.
2. CanDeactivate: 处理从当前路由离开的情况.
3. Resolve: 在路由激活之前请求服务器获取数据.

### 伪代码
``` typescript
const routes: Routes = [
  {
    path: 'folder',
    component: FolderComponent,
    canActivate: [LoginGuard],
    CanDeactivate: [UnsavedGuard],
    resolve: {
      folder: FolderResolve
    }
  }
];
@NgModule({
  ...,
  providers: [LoginGuard, UnsavedGuard, FolderResolve]
})
```

当使用 `resolve` 时, 可以在组件内接受数据 `Resolve` 守卫返回的数据.
```typescript
// 数据订阅(路由变化就会触发赋值)
this.routeInfo.data.subscribe((data: {folder: Folder}) => {
  this.folderId = data.folder['id'];
  this.folderName = data.folder['name'];
});
```
