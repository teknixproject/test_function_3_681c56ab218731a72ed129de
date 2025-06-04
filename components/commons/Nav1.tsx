'use client'
import React, { MouseEventHandler } from 'react';

interface User {
  id: number;
  firstName: string;
  age: number;
}

interface OnClickProps {
  id?: string;
  style?: React.CSSProperties;
  className?: string;
  users?: User[];
  onClickUser?: MouseEventHandler<HTMLElement> | undefined;
}

const UserList: React.FC<OnClickProps> = ({
  id,
  style,
  className,
  users = [{ id: 11, firstName: "Khoi", age: 24 }],
  onClickUser,
}) => {
  return (
    <div id={id} style={style} className={`p-4 bg-white rounded-lg shadow ${className || ''}`}>
      <h2 className="text-xl font-bold mb-4">User List</h2>
      <div className="space-y-2">
        {users.map(user => (
          <div 
            key={user.id}
            className="p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition cursor-pointer flex justify-between items-center"
            onClick={onClickUser}
          >
            <div>
              <h3 className="font-medium">{user.firstName}</h3>
              <p className="text-sm text-gray-600">ID: {user.id}</p>
            </div>
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
              {user.age} years old
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;