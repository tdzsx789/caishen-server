module.exports = {
  apps: [{
    name: "my-app",           // 应用名称，便于识别
    script: "npm",             // 要执行的命令
    args: "run start:prod",    // 传递给上述命令的参数
    instances: "max",           // 根据CPU核心数启动最大实例数，充分利用多核性能[6,7](@ref)
    exec_mode: "cluster",      // 启用集群模式，实现负载均衡[6,7](@ref)
    autorestart: true,         // 应用崩溃时自动重启
    watch: false,              // 禁用文件监听，生产环境不建议开启，避免意外重启
    max_memory_restart: "1G",  // 当内存占用超过1G时，PM2自动重启该实例，有效防止内存泄漏导致的卡顿[1,8](@ref)
    env: {
      NODE_ENV: "production"   // 设置环境变量
    },
    log_file: "logs/combined.log",          // 合并日志输出路径
    log_date_format: "YYYY-MM-DD HH:mm:ss", // 日志时间戳格式
    restart_delay: 3000,        // 异常重启前的延迟，避免频繁重启[8](@ref)
    min_uptime: "10s",         // 进程运行超过此时间才被认为是稳定的[8](@ref)
    max_restarts: 10,           // 最大异常重启次数[8](@ref)
  }]
};