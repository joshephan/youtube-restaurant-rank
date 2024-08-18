import React from 'react'
import Link from 'next/link'

/**
 * 화면 하단에 공용으로 사용되는 푸터입니다
 */
export default function Footer() {
  return (
    <footer className="bg-gray-100 py-6 mt-8">
      <div className="container mx-auto px-4 max-w-screen-xl">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">유튜브 먹방 맛집 랭킹</h3>
            <p className="text-sm text-gray-600">유튜버들이 추천하는 맛집 정보를 한눈에!</p>
          </div>
          <div className="w-full md:w-1/3 mb-4 md:mb-0">
            <h4 className="text-md font-semibold text-gray-700 mb-2">빠른 링크</h4>
            <ul className="text-sm">
              <li className="mb-1"><Link href="/rank" className="text-blue-600 hover:text-blue-800">랭킹</Link></li>
              <li className="mb-1"><Link href="/youtuber" className="text-blue-600 hover:text-blue-800">유튜버</Link></li>
              <li><Link href="/create" className="text-blue-600 hover:text-blue-800">맛집 등록</Link></li>
            </ul>
          </div>
          <div className="w-full md:w-1/3">
            <p className="text-sm text-gray-600">&copy; 2024 유튜브 먹방 맛집 랭킹. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
