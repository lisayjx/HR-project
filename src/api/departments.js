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
