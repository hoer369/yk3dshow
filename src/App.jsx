import React, { useState } from 'react'
import './App.css'
import Scene3D from './components/Scene3D'
import ControlPanel from './components/ControlPanel'

// 测试数据
const testData = {
  wipers: [
    {
      id: 1,
      name: '919',
      modelUrl: '/3dmodel/wiper_small.glb',
      adapters: [
        { id: 1, name: '1', modelUrl: '/3dmodel/kako.glb', armImage: 'https://via.placeholder.com/150?text=Adapter+1' },
        { id: 2, name: '2', modelUrl: '/3dmodel/kako.glb', armImage: 'https://via.placeholder.com/150?text=Adapter+2' },
        { id: 3, name: '3', modelUrl: '/3dmodel/kako.glb', armImage: 'https://via.placeholder.com/150?text=Adapter+3' },
        { id: 4, name: '4', modelUrl: '/3dmodel/kako.glb', armImage: 'https://via.placeholder.com/150?text=Adapter+4' },
        { id: 5, name: 'B1', modelUrl: '/3dmodel/kako.glb', armImage: 'https://via.placeholder.com/150?text=Adapter+B1' },
        { id: 6, name: 'B5', modelUrl: '/3dmodel/kako.glb', armImage: 'https://via.placeholder.com/150?text=Adapter+B5' },
      ]
    },
    {
      id: 2,
      name: '920',
      modelUrl: '/3dmodel/wiper_small.glb',
      adapters: [
        { id: 7, name: 'A', modelUrl: '/3dmodel/kako.glb', armImage: 'https://via.placeholder.com/150?text=Adapter+A' },
        { id: 8, name: 'B', modelUrl: '/3dmodel/kako.glb', armImage: 'https://via.placeholder.com/150?text=Adapter+B' },
        { id: 9, name: 'C', modelUrl: '/3dmodel/kako.glb', armImage: 'https://via.placeholder.com/150?text=Adapter+C' },
      ]
    },
    {
      id: 3,
      name: '921',
      modelUrl: '/3dmodel/wiper_small.glb',
      adapters: [
        { id: 10, name: 'X', modelUrl: '/3dmodel/kako.glb', armImage: 'https://via.placeholder.com/150?text=Adapter+X' },
        { id: 11, name: 'Y', modelUrl: '/3dmodel/kako.glb', armImage: 'https://via.placeholder.com/150?text=Adapter+Y' },
      ]
    }
  ]
}

function App() {
  const [currentWiper, setCurrentWiper] = useState(testData.wipers[0])
  const [currentAdapter, setCurrentAdapter] = useState(null)
  const [showArmImage, setShowArmImage] = useState(false)
  const [armImageUrl, setArmImageUrl] = useState('')

  // 处理雨刮器切换
  const handleWiperChange = (wiper) => {
    setCurrentWiper(wiper)
    setCurrentAdapter(null) // 重置卡扣选择
    setShowArmImage(false)
  }

  // 处理卡扣切换
  const handleAdapterClick = (adapter) => {
    if (currentAdapter && currentAdapter.id === adapter.id) {
      // 再次点击，取消选择
      setCurrentAdapter(null)
      setShowArmImage(false)
    } else {
      // 选择卡扣
      setCurrentAdapter(adapter)
      setArmImageUrl(adapter.armImage)
      setShowArmImage(true)
    }
  }

  // 确定当前要显示的模型URL
  const currentModelUrl = currentAdapter ? currentAdapter.modelUrl : currentWiper.modelUrl

  return (
    <div style={{ 
      width: '100vw', 
      minHeight: '100vh',
      backgroundImage: `url('https://hoer369.github.io/hoer.fstcode/bgbg.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      {/* 主内容区 */}
      <div style={{ 
        width: '100%', 
        maxWidth: '1200px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative'
      }}>
        {/* 3D展示区 */}
        <div style={{ 
          width: '100%', 
          height: '70vh', 
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          {/* 雨刮臂图片 - 右上角 */}
          {showArmImage && armImageUrl && (
            <div style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '120px',
              height: '120px',
              backgroundColor: 'white',
              borderRadius: '4px',
              boxShadow: '0 1px 5px rgba(0,0,0,0.1)',
              padding: '10px',
              zIndex: 10
            }}>
              <img 
                src={armImageUrl} 
                alt="Wiper Arm" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          )}
          <Scene3D modelUrl={currentModelUrl} />
        </div>

        {/* 控制面板 - 底部居中 */}
        <div style={{ 
          width: '100%', 
          maxWidth: '600px',
          textAlign: 'center',
          marginTop: '30px'
        }}>
          <ControlPanel 
            wipers={testData.wipers}
            currentWiper={currentWiper}
            currentAdapter={currentAdapter}
            onWiperChange={handleWiperChange}
            onAdapterClick={handleAdapterClick}
          />
        </div>
      </div>
    </div>
  )
}

export default App
