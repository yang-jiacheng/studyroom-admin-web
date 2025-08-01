<script setup lang="ts">
import { desEncode, desDecode } from '@/utils/desUtil';

// 表单数据
const encryptForm = reactive({
  plainText: '',
  secretKey: 'hG7kP9vT2yLmX4qA1cZbR5sU',
  result: ''
});

const decryptForm = reactive({
  encryptText: '',
  secretKey: 'hG7kP9vT2yLmX4qA1cZbR5sU',
  result: ''
});

// 加载状态
const encryptLoading = ref(false);
const decryptLoading = ref(false);

// 加密功能
const handleEncrypt = async () => {
  if (!encryptForm.plainText.trim()) {
    ElMessage.warning('请输入要加密的明文');
    return;
  }
  if (!encryptForm.secretKey.trim()) {
    ElMessage.warning('请输入密钥');
    return;
  }

  encryptLoading.value = true;
  try {
    const result = desEncode(encryptForm.plainText, encryptForm.secretKey);
    encryptForm.result = result;
    ElMessage.success('加密成功');
  } catch (error: any) {
    ElMessage.error(`加密失败: ${error.message}`);
    encryptForm.result = '';
  } finally {
    encryptLoading.value = false;
  }
};

// 解密功能
const handleDecrypt = async () => {
  if (!decryptForm.encryptText.trim()) {
    ElMessage.warning('请输入要解密的密文');
    return;
  }
  if (!decryptForm.secretKey.trim()) {
    ElMessage.warning('请输入密钥');
    return;
  }

  decryptLoading.value = true;
  try {
    const result = desDecode(decryptForm.encryptText, decryptForm.secretKey);
    decryptForm.result = result;
    ElMessage.success('解密成功');
  } catch (error: any) {
    ElMessage.error(`解密失败: ${error.message}`);
    decryptForm.result = '';
  } finally {
    decryptLoading.value = false;
  }
};

// 清空表单
const clearEncryptForm = () => {
  encryptForm.plainText = '';
  encryptForm.result = '';
};

const clearDecryptForm = () => {
  decryptForm.encryptText = '';
  decryptForm.result = '';
};

</script>

<template>
  <div class="des-example-container">
    <div class="page-header">
      <h1 class="title">3DES 加密解密工具</h1>
      <p class="subtitle">基于 crypto-js 的对称加密示例</p>
    </div>

    <div class="content-wrapper">
      <!-- 加密区域 -->
      <el-card class="operation-card encrypt-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <el-icon class="header-icon" color="#67c23a">
              <i-ep-lock />
            </el-icon>
            <span class="card-title">加密</span>
          </div>
        </template>

        <el-form :model="encryptForm" label-width="80px" label-position="top">
          <el-form-item label="密钥">
            <el-input
              v-model="encryptForm.secretKey"
              placeholder="请输入密钥（长度不少于24位）"
              show-password
              clearable
            />
          </el-form-item>

          <el-form-item label="明文">
            <el-input
              v-model="encryptForm.plainText"
              type="textarea"
              :rows="4"
              placeholder="请输入要加密的文本..."
              clearable
            />
          </el-form-item>

          <el-form-item label="加密结果">
            <el-input
              v-model="encryptForm.result"
              type="textarea"
              :rows="4"
              placeholder="加密结果将显示在这里"
              readonly
            >
            </el-input>
          </el-form-item>

          <div class="button-group">
            <el-button
              type="success"
              @click="handleEncrypt"
              :loading="encryptLoading"
              size="large"
            >
              <el-icon><i-ep-lock /></el-icon>
              开始加密
            </el-button>
            <el-button @click="clearEncryptForm" size="large">
              <el-icon><i-ep-delete /></el-icon>
              清空
            </el-button>
          </div>
        </el-form>
      </el-card>

      <!-- 解密区域 -->
      <el-card class="operation-card decrypt-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <el-icon class="header-icon" color="#e6a23c">
              <Unlock />
            </el-icon>
            <span class="card-title">解密</span>
          </div>
        </template>

        <el-form :model="decryptForm" label-width="80px" label-position="top">
          <el-form-item label="密钥">
            <el-input
              v-model="decryptForm.secretKey"
              placeholder="请输入密钥（需与加密时一致）"
              show-password
              clearable
            />
          </el-form-item>

          <el-form-item label="密文">
            <el-input
              v-model="decryptForm.encryptText"
              type="textarea"
              :rows="4"
              placeholder="请输入要解密的密文..."
              clearable
            />
          </el-form-item>

          <el-form-item label="解密结果">
            <el-input
              v-model="decryptForm.result"
              type="textarea"
              :rows="4"
              placeholder="解密结果将显示在这里"
              readonly
            >
            </el-input>
          </el-form-item>

          <div class="button-group">
            <el-button
              type="warning"
              @click="handleDecrypt"
              :loading="decryptLoading"
              size="large"
            >
              <el-icon><i-ep-unlock /></el-icon>
              开始解密
            </el-button>
            <el-button @click="clearDecryptForm" size="large">
              <el-icon><i-ep-delete /></el-icon>
              清空
            </el-button>
          </div>
        </el-form>
      </el-card>
    </div>

    <!-- 使用说明 -->
    <el-card class="info-card" shadow="never">
      <template #header>
        <div class="card-header">
          <el-icon class="header-icon" color="#409eff">
            <i-ep-info-filled />
          </el-icon>
          <span class="card-title">使用说明</span>
        </div>
      </template>

      <div class="info-content">
        <el-alert
          title="注意事项"
          type="info"
          :closable="false"
          show-icon
        >
          <ul class="info-list">
            <li>密钥长度必须不少于 24 位字符</li>
            <li>加密和解密时需要使用相同的密钥</li>
            <li>本工具与后端 Java DESUtil 保持一致</li>
            <li>加密结果为 Base64 编码格式</li>
          </ul>
        </el-alert>
      </div>
    </el-card>
  </div>
</template>

<style scoped>
.des-example-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.title {
  font-size: 2.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 10px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.subtitle {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin: 0;
}

.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  max-width: 1400px;
  margin: 0 auto;
  margin-bottom: 30px;
}

@media (max-width: 1024px) {
  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

.operation-card {
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.operation-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.encrypt-card {
  border-top: 4px solid #67c23a;
}

.decrypt-card {
  border-top: 4px solid #e6a23c;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-icon {
  font-size: 1.2rem;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
}

.button-group {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 20px;
}

.info-card {
  max-width: 600px;
  margin: 0 auto;
  border-radius: 16px;
  border-top: 4px solid #409eff;
}

.info-content {
  padding: 0;
}

.info-list {
  margin: 0;
  padding-left: 20px;
  line-height: 1.8;
}

.info-list li {
  color: #606266;
  margin-bottom: 8px;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #2c3e50;
}

:deep(.el-textarea__inner),
:deep(.el-input__inner) {
  border-radius: 8px;
  border: 2px solid #e4e7ed;
  transition: all 0.3s ease;
}

:deep(.el-textarea__inner:focus),
:deep(.el-input__inner:focus) {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

:deep(.el-button) {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

:deep(.el-button:hover) {
  transform: translateY(-2px);
}

:deep(.el-card__body) {
  padding: 24px;
}

:deep(.el-alert) {
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
}
</style>
