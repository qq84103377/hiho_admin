import request from '@/utils/request'
import qiNiu from '@/utils/qiniu'

// 获取七牛云上传token
export const getPictureUploadToken = params => {
  return request.get(`/web/public/getPictureUploadToken`, {params: params});
};

// 上传图片的接口
export const upDetailImgs = params => {
  return request.post(qiNiu.upUrl, params)
}

