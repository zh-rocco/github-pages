---
layout: post
title: 依赖注入
author: Simple
tags:
  - dependency injection
categories:
  - Angular
comments: true
date: 2017-09-22 23:30:00

---

## 基础知识

### 什么是依赖注入
1. 依赖注入: Dependency Injection 简称 DI
2. 控制反转: Inversion of Control 简称 IOC

> 实现了 "控制反转" 模式的框架被称为 IOC 容器, Angular 是一个 IOC 容器, Angular 实现 "控制反转" 的手段是 "依赖注入".

### 依赖注入的优点
1. 松耦合, 可重用性.
2. 提高可测性.


## 深入

### 注入器
Angular "依赖注入" 的注入点只有一个: `constructor`.
``` typescript
constructor(
  private folderService: FolderService
) {}
```

#### 手动使用注入器
*仅供理解时使用这种方式, 实际开发中不用.*
``` typescript
private folderService: FolderService;

constructor(
  private injector: Injector
) {
  this.folderService = injector.get(FolderService);
}
```

#### 注入器的层级关系
1. 应用级注入器(AppModule)

2. 主组件注入器(AppComponent)

3. 子组件注入器(ChildComponent)



### 提供器
在 `module` 或 `component` 里指定 `providers` 来告诉 Angular 哪些对象需要 "依赖注入".
``` typescript
@NgModule({
  providers: [FolderService] // 等同: providers: [{provide: FolderService, useClass: FolderService}]
})
// providers 其他写法:
// providers: [{provide: FolderService, useClass: AnotherFolderService}]
// providers: [{provide: FolderService, useFactory:() => {...}}]
```

#### 提供器的作用域
1. "提供器" 可以声明在模块(module)和组件(component)里.
2. 当一个 "提供器" 声明在模块里时, 该 "提供器" 对当前模块下的所有组件可见.
3. 当一个 "提供器" 声明在组件里时, 该 "提供器" 只对当前组件及其当前组件下的所有子组件可见.
4. 使用 "提供器" 时遵循就近原则, 如果名字(token)相同, 会优先使用组件内声明的.
5. 优先考虑声明到模块内.

#### 工厂函数 "提供器"
``` typescript
@NgModule({
  providers: [
    {
      provide: FolderService,
      newFactory: (isDev, appConfig) => {
        // appConfig -> {isDev: false}
        if (isDev) {
          return new FolderService();
        } else {
          // 由于 IS_DEV_ENV 为 false, 所以永远执行这里
          return new AnotherFolderService();
        }
      },
      deps: ['IS_DEV_ENV', 'APP_CONFIG']
    },
    { provide: 'IS_DEV_ENV', useValue: false },
    {
      provide: 'APP_CONFIG', useValue: {isDev: false}
    }
  ]
})
```


## 其他

1. 在 "注入器" 里注入 `FolderService`, Angular 会去 "提供器" 里寻找同名的对象, 如: `provide` 对应的 `FolderService`, 然后 `new` 一个 `useClass` 对应的 `FolderService` 注入到被调用的地方.

### @Injectable 装饰器
1. `@Injectable()` 装饰器表示当前服务可以注入其他服务, 并不是说当前服务可以注入到其他服务里.
2. 想在 服务A 里注入 服务B, 需要将 服务B 声明在共同的父模块里.
3. `@Component()` 装饰器继承自 `@Injectable()`, 所以在组件里也可以注入其他服务.
