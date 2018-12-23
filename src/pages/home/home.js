import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import { dispatcher } from '@opcjs/zoro'

import ComponentCommonLogin from '../../components/common/login/login'
import ComponentCommonSlogan from '../../components/common/slogan/slogan'
import ComponentHomeNavigation from '../../components/home/navigation/navigation'
import ComponentHomeCarousel from '../../components/home/carousel/carousel'
import ComponentHomeBrand from '../../components/home/brand/brand'
import ComponentHomeMarket from '../../components/home/market/market'
import ComponentHomeHotSale from '../../components/home/hotSale/hotSale'

import styles from './home.scss'

@connect(({ hotSale }) => ({
  hotSaleNoMore: hotSale.noMore,
}))
class PageHome extends Component {
  config = {
    enablePullDownRefresh: true,
  }

  state = {
    // 请到README.md中查看此参数说明
    __TAB_PAGE__: true, // eslint-disable-line
  }

  componentDidMount() {
    dispatcher.banner.getBannerInfo()
    dispatcher.brand.getHotBrandList()
    dispatcher.hotSale.getHotSaleCommodityList(undefined, {
      loadingKey: 'init',
    })
  }

  onPullDownRefresh() {
    dispatcher.hotSale.resetPagination()
    Promise.all([
      dispatcher.banner.getBannerInfo(),
      dispatcher.brand.getHotBrandList(),
      dispatcher.hotSale.getHotSaleCommodityList(),
    ])
      .then(Taro.stopPullDownRefresh)
      .catch(Taro.stopPullDownRefresh)
  }

  onReachBottom() {
    const { hotSaleNoMore } = this.props
    if (hotSaleNoMore) return
    dispatcher.hotSale.getHotSaleCommodityList()
  }

  handleGoSearch = () => Taro.navigateTo({ url: '/pages/search/search' })

  render() {
    return (
      <View className={styles.home}>
        <ComponentCommonLogin />
        <ComponentHomeNavigation onSearch={this.handleGoSearch} />
        <ComponentHomeCarousel />
        <View className={styles.content}>
          <ComponentCommonSlogan />
          <ComponentHomeBrand />
          <ComponentHomeMarket />
          <ComponentHomeHotSale />
        </View>
      </View>
    )
  }
}

export default PageHome
