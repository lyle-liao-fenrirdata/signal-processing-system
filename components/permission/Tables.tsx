import { UserInfo, formatDate } from "@/pages/app/permission";

export const PermissionTable = ({
  users,
  openModal,
}: {
  users: UserInfo[];
  openModal: (user: UserInfo) => void;
}) => (
  <table className="w-full border-collapse items-center bg-transparent">
    <thead>
      <tr>
        <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold text-slate-500">
          使用者姓名
        </th>
        <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold text-slate-500">
          帳號
        </th>
        <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold text-slate-500">
          狀態
        </th>
        <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold text-slate-500">
          註冊時間
        </th>
        <th className="whitespace-nowrap border border-l-0 border-r-0 border-solid border-slate-100 bg-slate-50 px-6 py-3 text-left align-middle text-xs font-semibold text-slate-500">
          最後變更時間
        </th>
      </tr>
    </thead>
    <tbody>
      {users.length === 0 ? (
        <tr>
          <td
            colSpan={5}
            className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 text-center align-middle text-xs"
          >
            無資料
          </td>
        </tr>
      ) : (
        users.map((user) => (
          <tr
            key={user.account}
            className="cursor-pointer hover:bg-slate-100"
            onClick={() => {
              openModal(user);
            }}
          >
            <th className="flex items-center whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 text-left align-middle text-xs">
              {user.username}
            </th>
            <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
              {user.account}
            </td>
            <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
              {Boolean(user.deletedAt) ? "停用" : "啟用"}
            </td>
            <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
              {formatDate.format(user.createdAt)}
            </td>
            <td className="whitespace-nowrap border-l-0 border-r-0 border-t-0 px-6 py-2 align-middle text-xs">
              {formatDate.format(user.updatedAt)}
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
);
