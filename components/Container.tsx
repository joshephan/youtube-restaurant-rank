import React from 'react'

/**
 * 최상위 컨테이너
 * 스타일이 아직 미정이니까 일단 div만 해둠
 */
export default function Container({children}: {
  children: React.ReactNode
}) {
  return (
    <div>
      {children}
    </div>
  )
}
