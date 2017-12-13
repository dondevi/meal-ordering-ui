<!--
/**
 * =============================================================================
 *  Main 主框架
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-08-24
 *
 */
-->


<template>
  <section class="page">

    <header class="unselect">
      <h1>
        <span class="el-icon-time"></span> 订餐管理
      </h1>
      <nav>
        <router-link tag="li" to="/calendar">日历</router-link>
        <router-link tag="li" to="/kanban">看板</router-link>
        <li style="opacity: 1;">
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              {{ userInfo.urealname }}
              <i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <router-link to="/logout">退出</router-link>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
      </nav>
    </header>

    <main>
      <router-view></router-view>
    </main>

  </section>
</template>



<script>
  import { getUserInfo } from "service";
  export default {
    data: () => ({
      userInfo: window.userInfo,
    }),
  };
</script>



<style scoped>
  header {
    position: relative;
    z-index: 100;
    height: 60px;
    padding: 0 20px;
    background-color: #20a0ff;
    color: #fff;
    line-height: 60px;
  }
    h1 {
      float: left;
      margin: 0;
      font-size: 22px;
      font-weight: normal;
      letter-spacing: 1px;
    }
  nav {
    float: right;
    height: 100%;
    margin: 0;
    padding: 0;
    background: transparent;
    font-size: 16px;
  }
    nav > li {
      display: inline-block;
      position: relative;
      margin-left: 10px;
      padding: 0 10px;
      cursor: pointer;
      opacity: 0.8;
    }
    nav > li.router-link-active {
      height: calc(100% - 3px);
      border-bottom: 3px solid rgba(255,255,255,0.8);
      opacity: 1;
    }
    .el-dropdown {
      cursor: pointer;
    }
      .el-dropdown-link {
        display: block;
        height: 100%;
        color: #fff;
        font-size: 16px;
      }
      .el-dropdown-menu__item > a {
        display: block;
        color: inherit;
        text-align: center;
        text-decoration: none;
      }
  main {
    height: calc(100% - 60px);
    border-bottom: 1px solid #324057;
  }
</style>
