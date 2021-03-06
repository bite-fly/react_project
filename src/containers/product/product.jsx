import React from 'react'
import { Card,Button,Icon,Select,Input,Table,message } from 'antd'
import { reqProductList,reqUpdateProdStatus,reqSearchProduct } from '../../api';
import { connect } from 'react-redux';
import { creatSaveProductAction } from '../../redux/action_creators/product_action';
import { PAGE_SIZE } from '../../config';

const {Option} = Select

@connect(
  state=>({productList:state.productList}),
  {
    saveProduct:creatSaveProductAction
  }
)
class Product extends React.Component{
  state={
    productList:[],
    total:'',
    current:1, 
    keyWord:'',
    searchType:'productName',
    isLoading:true
  }
  getProductList = async(number=1)=> {
    let result
    if (this.isSearch) {
      const {searchType,keyWord}=this.state
      result = await reqSearchProduct(number,PAGE_SIZE,searchType,keyWord)
    } else {
      result = await reqProductList(number,PAGE_SIZE)
    }
    this.setState({isLoading:false})
    const {status,data}=result
    if(status===0){
      this.setState({
        productList:data.list,
        total:data.total,
        current:data.pageNum
      })
      //把获取的商品列表存入redux中
      this.props.saveProduct(data.list)
    }else{
      message.error('获取商品列表失败')
    }
  }
  componentDidMount(){
    this.getProductList()
  }

  updateProStatus= async(id,status)=>{
    let productList =[...this.state.productList]
    if (status===1) {
      status=2
    } else {
      status=1
    }
    let result = await reqUpdateProdStatus(id,status)

    if (result.status===0) {
      message.success('更新状态成功')
      productList=productList.map((item)=>{
        if (item._id===id) {
          item.status=status
        }
        return item
      })
      this.setState({productList})
    }else{
      message.error('更新状态失败')
    }
  }
  search= ()=>{
     this.isSearch=true
     this.getProductList()
  }
  render(){
    const dataSource = this.state.productList
    
    const columns = [
      {
        title: '商品名称',
        width:'18%',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '商品描述',
        dataIndex: 'desc',
        key: 'desc',
      },
      {
        title: '价格',
        align:'center',
        width:'10%',
        dataIndex: 'price',
        key: 'price',
        render:(price)=>{return '￥'+price}
      },
      {
        title: '状态',
        align:'center',
        width:'10%',
        // dataIndex: 'status',
        key: 'status',
        render:(item)=>{
          const {_id,status}=item
          return(
            <div>
              <Button 
                type={status===1 ? 'danger':'primary'}
                onClick={()=>{this.updateProStatus(_id,status)}}
              >
                {status===1 ? '下架':'上架'}
              </Button><br/>
              <span>{status===1 ? '在售':'售罄'}</span>
            </div>
          )
        }
      },
      {
        title: '操作',
        align:'center',
        width:'10%',
        // dataIndex: 'opera',
        key: 'opera',
        render:(item)=>{
          return(
            <div>
              <Button type='link' onClick={()=>{this.props.history.push(`/admin/pro_about/product/detail/${item._id}`)}}>详情</Button><br/>
              <Button type='link' onClick={()=>{this.props.history.push(`/admin/pro_about/product/add_update/${item._id}`)}}>修改</Button>
            </div>
          )
        }
      },
    ];
    return(

      <Card 
        title={
          <div>
            <Select defaultValue='productName' onChange={(value)=>{this.setState({searchType:value})}}>
              <Option value='productName'>按名称搜索</Option>
              <Option value='productDesc'>按描述搜索</Option>
            </Select>
            <Input 
              style={{margin : '0px 10px',width:'20%'}}
              placeholder='请输入搜索关键字'
              allowClear
              onChange={(event)=>{this.setState({keyWord:event.target.value})}}
            />
            <Button type='primary' onClick={this.search}><Icon type='search' />搜索</Button>
          </div>
        }
        extra={<Button type='primary' onClick={()=>{this.props.history.push('/admin/pro_about/product/add_update')}}><Icon type='plus-circle' />添加商品</Button>}
      >

        <Table 
          dataSource={dataSource} 
          columns={columns} 
          bordered
          rowKey='_id'
          loading={this.state.isLoading}
          pagination={{
            total:this.state.total,
            pageSize:PAGE_SIZE,
            current:this.state.current,
            onChange:this.getProductList
          }}
        />
      </Card>






    )
  }
}
export default Product