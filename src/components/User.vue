<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editUserDialog"
      width="50%"
      @close="$refs.editUserRef.resetFields()"
    >
      <el-form :rules="editUserRules" ref="editUserRef" :model="editUser" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUser.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="editUser.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUser.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="xiugai()">确定</el-button>
      </span>
    </el-dialog>

    <!-- 添加用户 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialog"
      width="50%"
      @close="$refs.addUserRef.resetFields()"
    >
      <el-form :rules="addUserRules" ref="addUserRef" :model="addUser" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUser.username" ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUser.password"></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="mobile">
          <el-input v-model="addUser.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUser.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialog = false">取 消</el-button>
        <el-button type="primary" @click="tanjia()">确定</el-button>
      </span>
    </el-dialog>

    <el-card class="box-card">
      <!-- 搜索框和添加按钮 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入搜索内容"
            class="input-with-select"
            clearable
            @clear="getUserList()"
            v-model="querycdt.query"
            @keyup.enter.native="getUserList()"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
          </el-input>
        </el-col>
        <!-- 按钮 -->
        <el-col :span="8">
          <el-button type="primary" @click="addUserDialog=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 数据列表展示区 -->
      <el-table :data="userList" border stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="140"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="140"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="70">
          <!-- <span slot-scope="info">{{info.row.mg_state===true?'显示':'不显示'}}</span> -->
          <el-switch v-model="info.row.mg_state" slot-scope="info"></el-switch>
        </el-table-column>
        <el-table-column label="操作" width="270">
          <template slot-scope="info">
            <!-- 修改操作 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="showEditDialog(info.row.id)"
            ></el-button>
            <!-- 删除操作 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="delUser(info.row.id)"
            ></el-button>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="small"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querycdt.pagenum"
        :page-sizes="[3, 5, 10, 20]"
        :page-size="querycdt.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tot"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList()
  },
  methods: {
    //   展示修改用户
    xiugai() {
      //表单再次校验
      this.$refs.editUserRef.validate(async valid => {
        if (valid === true) {
          //获得修改数据 传递给服务器
          const { data: dt } = await this.$http.put(
            'users/' + this.editUser.id,
            this.editUser
          )
          console.log(dt)
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          //数据添加成功， 提示信息，关闭对话框，数据刷新
          this.$message.success(dt.meta.msg)
          this.editUserDialog = false
          this.getUserList()
        }
      })
    },
    // 展示修改用户的对话框
    async showEditDialog(id) {
      const { data: dt } = await this.$http.get('users/' + id)
      this.editUser = dt.data
      this.editUserDialog = true
    },

    //   删除用户
    delUser(id) {
      this.$confirm('确认要删除吗？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          //实现删除逻辑
          const { data: dt } = await this.$http.delete('users/' + id)
          console.log(dt)
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          this.$message.success(dt.meta.msg)
          if (this.userList.length === 1 && this.querycdt.pagenum > 1) {
            this.querycdt.pagenum--
          }
          //刷新数据
          this.getUserList()
        })
        .catch(() => {})
    },
    //   添加用户
    tanjia() {
      // 表单再次校验
      this.$refs.addUserRef.validate(async valid => {
        if (valid === true) {
          // 把添加号的各项表单域信息传递到服务器上面存储
          const { data: dt } = await this.$http.post('users', this.addUser)
          //   console.log(dt)
          if (dt.meta.status !== 201) {
            return this.$message.error(dt.meta.msg)
          }
          //数据添加成功， 提示信息，关闭对话框，数据刷新
          this.$message.success(dt.meta.msg)
          this.addUserDialog = false
          this.getUserList()
        }
      })
    },

    handleSizeChange(arg) {
      // arg: 变化后的记录条数
      //   console.log(arg)
      this.querycdt.pagesize = arg
      // 重新根据条件获得数据
      this.getUserList()
    },
    // 当前页码变化的回调处理
    handleCurrentChange(arg) {
      // arg: 变化后的当前页码值
      // console.log(arg)
      this.querycdt.pagenum = arg
      // 根据变化后的页码重新获得数据
      this.getUserList()
    },
    async getUserList() {
      const { data: dt } = await this.$http.get('/users', {
        params: this.querycdt
      })
      //   console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.tot = dt.data.total
      this.userList = dt.data.users
    }
  },
  data() {
    var checkMobile = (rule, value, callback) => {
      if (!/^1[35789]\d{9}$/.test(value)) {
        // 校验失败(请给页面提示错误信息)
        return callback(new Error('手机号码格式不正确'))
      }
      callback()
    }
    return {
      // 对话框是否显示
      //   修改
      editUserDialog: false,
      //校验表单项
      editUserRules: {
        mobile: [
          { required: true, message: '用户名必填', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      editUser: {
        username: '',
        mobile: '',
        email: ''
      },
      //    添加
      addUserRules: {
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }],
        mobile: [
          { required: true, message: '手机号码必填', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      addUser: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addUserDialog: false,
      userList: [],
      //   总记录条数
      tot: 0,
      querycdt: {
        query: '', // 搜索关键字
        pagenum: 1, // 当前页码
        pagesize: 3 // 每页显示数据条数
      }
    }
  }
}
</script>
