import { useCallback, useEffect, useRef, useState } from "react";
import { TextInput } from "@/components/TextInput";
import { User } from ".prisma/client";
import { onSearchUsers } from "@/actions/user.actions";
import { useServerAction } from "@/hooks/useServerAction";
import { debounce } from "ts-debounce";
import { UserProfileLink } from "@/components/UserProfileLink";
import { useOnClickOutside } from "usehooks-ts";
import { usePathname } from "next/navigation";

export const Search = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const [searchUsers, isSearchingUsers] = useServerAction(
    onSearchUsers,
    (res) => {
      setIsLoading(false);
      if (!res.success) return setUsers([]);
      setUsers(res.data.users);
    },
    console.error
  );

  const search = useCallback(debounce(searchUsers, 700), []);

  const containerRef = useRef<HTMLDivElement>(null);
  const handleClickOutside = () => {
    setIsFocused(false);
  };

  useOnClickOutside(containerRef, handleClickOutside);

  useEffect(() => {
    setIsFocused(false);
  }, [pathname]);

  useEffect(() => {
    if (searchTerm.length < 1) return;
    setIsLoading(true);
    search(searchTerm);
  }, [searchTerm]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-lg"
      onFocus={() => setIsFocused(true)}
    >
      <TextInput
        placeholder="Search users..."
        onChange={setSearchTerm}
        value={searchTerm}
      />
      {isFocused && searchTerm && (
        <div className="absolute top-[120%] flex max-h-[400px] w-full flex-col gap-4 overflow-y-auto rounded-md bg-gray-900 p-4">
          <p className="text-sm text-gray-300">
            Search results for: {searchTerm}
          </p>
          {isSearchingUsers || isLoading ? (
            <p className="text-sm text-gray-300">Searching...</p>
          ) : users.length < 1 ? (
            <p className="text-sm text-gray-300">Not found</p>
          ) : (
            users.map((user) => <UserProfileLink user={user} key={user.id} />)
          )}
        </div>
      )}
    </div>
  );
};
