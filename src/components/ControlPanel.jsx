import React from 'react'

function ControlPanel({ wipers, currentWiper, currentAdapter, onWiperChange, onAdapterClick }) {
  // 处理雨刮器切换
  const handleWiperChange = (e) => {
    const wiperId = parseInt(e.target.value)
    const wiper = wipers.find(w => w.id === wiperId)
    if (wiper) {
      onWiperChange(wiper)
    }
  }

  return (
    <div style={{ 
      width: '100%',
      textAlign: 'center'
    }}>
      {/* 雨刮器选择 */}
      <div style={{ marginBottom: '20px' }}>
        <span style={{
          fontSize: '16px',
          fontWeight: '600',
          color: 'black',
          marginRight: '15px'
        }}>
          Wiper:
        </span>
        <select 
          style={{
            padding: '8px 16px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '16px',
            backgroundColor: 'white',
            cursor: 'pointer',
            outline: 'none',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            minWidth: '120px'
          }}
          value={currentWiper.id}
          onChange={handleWiperChange}
        >
          {wipers.map(wiper => (
            <option key={wiper.id} value={wiper.id}>
              {wiper.name}
            </option>
          ))}
        </select>
      </div>

      {/* 卡扣选择 */}
      <div style={{ marginBottom: '10px' }}>
        <span style={{
          fontSize: '16px',
          fontWeight: '600',
          color: 'black',
          marginRight: '15px',
          display: 'inline-block',
          marginBottom: '15px'
        }}>
          Adapter:
        </span>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '15px', 
          justifyContent: 'center',
          marginTop: '10px'
        }}>
          {currentWiper.adapters.map(adapter => (
            <button
              key={adapter.id}
              style={{
                padding: '10px 20px',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                ...(currentAdapter && currentAdapter.id === adapter.id 
                  ? {
                      backgroundColor: 'black',
                      color: 'white',
                      border: '1px solid black'
                    } 
                  : {
                      backgroundColor: 'white',
                      color: 'black',
                      border: '1px solid #ddd',
                      ':hover': {
                        backgroundColor: '#f5f5f5'
                      }
                    })
              }}
              onClick={() => onAdapterClick(adapter)}
            >
              {adapter.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ControlPanel