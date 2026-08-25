interface UserSelectFilterProps {
  users: string[];
  selectedUser: string;
  onChangeUser: (user: string) => void;
}

export default function UserSelectFilter({
  users,
  selectedUser,
  onChangeUser,
}: UserSelectFilterProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-gray-600 font-medium min-w-[60px]">수험자</span>
      <div className="relative flex-1">
        <select
          value={selectedUser}
          onChange={(e) => onChangeUser(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 appearance-none outline-none focus:border-blue-500"
        >
          {users.map((user) => (
            <option key={user} value={user}>
              {user}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}