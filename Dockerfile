# 使用 Node.js 的官方镜像作为基础
FROM node:14

# 设置工作目录
WORKDIR /app

# 将 package.json 和 package-lock.json 复制到容器中
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 将整个项目复制到容器中
COPY . .

# 定义容器启动时运行的命令
CMD ["npm", "run", "dev"]
