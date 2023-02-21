/**
 * 组织架构接口
 */
import request from '@/utils/request'
// 查询企业的部门列表
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}
//
// 根据ID删除部门
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}
// 新增部门
export function addDepartment(data) {
  return request({
    method: 'POST',
    url: '/company/department',
    data
  })
}
// 获取部门详情信息
export function getDepartmentDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}
// 根据ID修改部门详情
export function editDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'PUT',
    data
  })
}
