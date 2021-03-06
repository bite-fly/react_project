// import React, {Component, Fragment} from 'react';
// import {Button, Card, Form, Input, Modal, Table, message, Tree} from "antd";
// import {PlusCircleOutlined} from "@ant-design/icons";
// import dayjs from "dayjs";
// import {reqAddRole, reqRolePaginationList, reqAllocatePermission} from "../../api";
// import {PAGE_SIZE} from "../../config";
// import menuList from "../../config/menuConfig";
// import {connect} from "react-redux";

// /**
//  * 角色管理路由组件
//  */
// @connect(
//     state => ({
//         userInfo: state.login,
//     })
// )
// class Role extends Component {

//     addFormRef = React.createRef();

//     authFormRef = React.createRef();

//     state = {
//         isShowAdd: false, //是否显示新增权限模态框
//         isShowAuth: false,  //是否显示分配权限模态框
//         total: 0, //总数
//         current: 1,//当前页面
//         dataSource: [], //角色列表
//         _id: '',//分配角色的id
//         checkedKeys: [], //树形菜单选中的key
//         treeData: [], //树形菜单的数据
//     }

//     componentDidMount = async () => {
//         const {current} = this.state;
//         this.getRoleList(current, PAGE_SIZE);
//         let treeData = [
//             {
//                 title: '平台权限',
//                 key: 'top',
//                 children: [...menuList]
//             }
//         ]
//         this.setState({
//             treeData
//         })
//     }

//     //获取分页列表
//     getRoleList = async (current, pagesize) => {

//         const {status, data, msg} = await reqRolePaginationList(current, pagesize);
//         if (status === 0) {
//             const {list, total} = data;
//             this.setState({
//                 dataSource: list,
//                 current,
//                 total
//             })
//         } else {
//             message.error(msg, 2)
//         }
//     }

//     //表单变化
//     handleTableChange = (pagination) => {
//         const {current, pageSize} = pagination;
//         this.getRoleList(current, pageSize);
//     }

//     //新增角色确认模态框
//     handleAddOkModal = async () => {
//         try {
//             //表单的统一验证
//             const {roleName} = await this.addFormRef.current.validateFields()
//             const {status, msg} = await reqAddRole(roleName);
//             if (status === 0) {
//                 //取消模态框
//                 this.setState({isShowAdd: false}, () => {
//                     //重置表单
//                     this.addFormRef.current.resetFields();
//                     //刷新角色
//                     this.getRoleList();
//                     //提示信息
//                     message.success('新增角色成功', 2);
//                     const {current} = this.state;
//                     this.getRoleList(current, PAGE_SIZE);
//                 });
//             } else {
//                 message.error(msg, 2);
//             }
//         } catch (e) {
//             message.error('表单输入有误，请检查', 2);
//         }
//     }

//     //取消新增角色模态框
//     handleAddCancelModal = () => {
//         //重置表单
//         this.addFormRef.current.resetFields();
//         //取消模态框
//         this.setState({isShowAdd: false});
//     }

//     //分配权限确认模态框
//     handleAuthOkModal = async () => {
//         //获取选择的key
//         const {checkedKeys, _id} = this.state;
//         //获取授权人
//         let authName = this.props.userInfo.user.username;
//         const {status, msg} = await reqAllocatePermission(_id, checkedKeys, authName);
//         if (status === 0) {
//             message.success("分配权限成功", 2)
//             //取消模态框
//             this.setState({isShowAuth: false, checkedKeys: []}, () => {
//                 const {current} = this.state;
//                 this.getRoleList(current, PAGE_SIZE);
//             });
//         } else {
//             message.error(msg, 2);
//         }
//     }

//     //分配权限取消模态框
//     handleAuthCancelModal = () => {
//         //重置表单
//         this.authFormRef.current.resetFields();
//         //取消模态框
//         this.setState({isShowAuth: false});
//     }

//     //分配权限按钮的点击事件
//     allocatePermission = (item) => {
//         const {dataSource} = this.state;
//         //回显菜单树
//         let menu = dataSource.find(menu => menu._id === item._id);
//         if (menu) {
//             let menus = menu.menus;
//             if (menus && menus instanceof Array) {
//                 this.setState({checkedKeys:menus});
//             }
//         }
//         //更新状态
//         this.setState({
//             isShowAuth: true,
//             _id: item._id
//         })

//     }

//     render() {

//         const columns = [
//             {
//                 title: '角色名称',
//                 dataIndex: 'name',
//                 key: 'name'
//             },
//             {
//                 title: '创建时间',
//                 dataIndex: 'create_time',
//                 key: 'create_time',
//                 render: item => {
//                     return dayjs(item).format('YYYY-MM-DD HH:mm:ss')
//                 }
//             },
//             {
//                 title: '授权时间',
//                 dataIndex: 'auth_time',
//                 key: 'auth_time',
//                 render: (time) => time? dayjs(time).format('YYYY-MM-DD HH:mm:ss') : ''
                
//             },
//             {
//                 title: '授权人',
//                 dataIndex: 'auth_name',
//                 key: 'auth_name'
//             },
//             {
//                 title: '操作',
//                 key: 'operator',
//                 render: (item) => (
//                     <Button type="link" onClick={() => this.allocatePermission(item)}>分配权限</Button>
//                 ),
//                 width: "25%",
//                 align: 'center'
//             }
//         ];

//         const {isShowAdd, total, current, dataSource, isShowAuth, treeData} = this.state;

//         return (
//             <Fragment>
//                 <Card title={
//                     <Button type="primary"  onClick={() => {
//                         this.setState({isShowAdd: true})
//                     }}>添加角色</Button>
//                 }>
//                     <Table bordered={true} rowKey={"_id"} dataSource={dataSource} columns={columns}
//                            pagination={{
//                                current,
//                                pageSize: PAGE_SIZE,
//                                total,
//                                showQuickJumper: true,
//                            }} onChange={this.handleTableChange}/>
//                 </Card>
//                 {/* 添加角色模态框 */}
//                 <Modal title={`添加角色`} visible={isShowAdd} onOk={this.handleAddOkModal}
//                        onCancel={this.handleAddCancelModal} okText="确认" cancelText="取消">
//                     <Form ref={this.addFormRef}>
//                         <Form.Item name="roleName"
//                                    rules={[{required: true, whitespace: true, message: '请输入角色名称'},]}>
//                             <Input placeholder="请输入角色名称" autoComplete="off"/>
//                         </Form.Item>
//                     </Form>
//                 </Modal>
//                 {/* 分配角色模态框 */}
//                 <Modal title={`分配权限`} visible={isShowAuth} onOk={this.handleAuthOkModal}
//                        onCancel={this.handleAuthCancelModal} okText="确认" cancelText="取消">
//                     <Form ref={this.authFormRef}>
//                         <Tree
//                             defaultExpandAll
//                             checkable
//                             onCheck={(checkedKeysValue) => {
//                                 this.setState({checkedKeys: checkedKeysValue})
//                             }}
//                             checkedKeys={this.state.checkedKeys}
//                             treeData={treeData}
//                         />
//                     </Form>
//                 </Modal>
//             </Fragment>
//         );
//     }
// }


// export default Role
