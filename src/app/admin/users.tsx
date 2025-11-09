/**
 * User Management Page
 * Story 9.2: Build User Management Page
 *
 * Admin page for managing users with:
 * - Searchable table (name, email, role, joined date, last active, progress)
 * - Search bar
 * - Sort by columns
 * - Pagination (50 per page)
 * - Expandable rows with user details (profile, progress, activity, notes/tasks counts)
 * - View as user and delete user buttons
 * - Bulk actions (export CSV)
 */

import { useEffect, useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import {
  IconSearch,
  IconDownload,
  IconChevronDown,
  IconChevronUp,
  IconEye,
  IconTrash,
  IconArrowRight,
  IconArrowLeft,
} from '@tabler/icons-react';
import { hebrewLocale } from '../../lib/locale/he';
import {
  fetchUsers,
  fetchUserDetails,
  deleteUser,
  exportToCSV,
  type UserManagementRow,
  type UserDetails,
  type SortColumn,
} from '../../lib/actions/admin';
import { formatDistanceToNow } from 'date-fns';
import { he } from 'date-fns/locale';

/**
 * User Management Page Component
 */
export function UserManagementPage() {
  const [users, setUsers] = useState<UserManagementRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<SortColumn>('createdAt');
  const [sortAscending, setSortAscending] = useState(false);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const pageSize = 50;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Fetch users
  useEffect(() => {
    async function loadUsers() {
      setIsLoading(true);
      try {
        const result = await fetchUsers(currentPage, pageSize, searchTerm, sortColumn, sortAscending);
        setUsers(result.users);
        setTotalCount(result.totalCount);
      } catch (error) {
        console.error('Error loading users:', error);
        alert('שגיאה בטעינת משתמשים');
      } finally {
        setIsLoading(false);
      }
    }

    loadUsers();
  }, [currentPage, searchTerm, sortColumn, sortAscending]);

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(0); // Reset to first page on search
  };

  // Handle sort change
  const handleSortChange = (column: SortColumn) => {
    if (sortColumn === column) {
      // Toggle sort direction
      setSortAscending(!sortAscending);
    } else {
      // Change sort column and default to descending
      setSortColumn(column);
      setSortAscending(false);
    }
    setCurrentPage(0); // Reset to first page on sort
  };

  // Handle row expansion
  const handleToggleExpand = async (userId: string) => {
    if (expandedUserId === userId) {
      // Collapse
      setExpandedUserId(null);
      setUserDetails(null);
    } else {
      // Expand and fetch details
      setExpandedUserId(userId);
      setIsLoadingDetails(true);
      try {
        const details = await fetchUserDetails(userId);
        setUserDetails(details);
      } catch (error) {
        console.error('Error loading user details:', error);
        alert('שגיאה בטעינת פרטי משתמש');
      } finally {
        setIsLoadingDetails(false);
      }
    }
  };

  // Handle delete user
  const handleDeleteUser = async (userId: string) => {
    // Confirm deletion
    const confirmed = window.confirm(
      hebrewLocale.pages.admin.confirmDeleteUserMessage
    );

    if (!confirmed) return;

    setDeletingUserId(userId);
    try {
      await deleteUser(userId);
      alert(hebrewLocale.pages.admin.userDeleted);

      // Refresh users list
      const result = await fetchUsers(currentPage, pageSize, searchTerm, sortColumn, sortAscending);
      setUsers(result.users);
      setTotalCount(result.totalCount);

      // Close expanded row if it was the deleted user
      if (expandedUserId === userId) {
        setExpandedUserId(null);
        setUserDetails(null);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(hebrewLocale.pages.admin.userDeleteFailed);
    } finally {
      setDeletingUserId(null);
    }
  };

  // Handle view as user (navigate to dashboard with user context)
  const handleViewAsUser = () => {
    // In a real implementation, you'd set up an impersonation system
    // For now, we'll just show an alert
    alert('תכונה זו תיושם בעתיד');
  };

  // Handle export CSV
  const handleExportCSV = () => {
    exportToCSV(users, 'users');
  };

  // Handle pagination
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">
              {hebrewLocale.pages.admin.userManagement}
            </h1>
            <p className="text-muted-foreground">{hebrewLocale.pages.admin.loading}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            {hebrewLocale.pages.admin.userManagement}
          </h1>
          <p className="text-muted-foreground">
            {hebrewLocale.pages.admin.userManagementDescription}
          </p>
        </div>

        {/* Search and Actions Bar */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between">
            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <IconSearch
                size={20}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <Input
                type="text"
                placeholder={hebrewLocale.pages.admin.searchUsers}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pr-10"
              />
            </div>

            {/* Sort and Export */}
            <div className="flex gap-2">
              <Select
                value={sortColumn}
                onValueChange={(value) => handleSortChange(value as SortColumn)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={hebrewLocale.pages.admin.sortBy} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="displayName">
                    {hebrewLocale.pages.admin.sortByName}
                  </SelectItem>
                  <SelectItem value="email">
                    {hebrewLocale.pages.admin.sortByEmail}
                  </SelectItem>
                  <SelectItem value="createdAt">
                    {hebrewLocale.pages.admin.sortByJoined}
                  </SelectItem>
                  <SelectItem value="progressPercentage">
                    {hebrewLocale.pages.admin.sortByProgress}
                  </SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="default"
                onClick={handleExportCSV}
                disabled={users.length === 0}
              >
                <IconDownload size={16} className="ml-2" />
                {hebrewLocale.pages.admin.exportCSV}
              </Button>
            </div>
          </div>
        </Card>

        {/* Users Table */}
        <Card className="p-6">
          {users.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              {hebrewLocale.pages.admin.noData}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSortChange('displayName')}
                    >
                      <div className="flex items-center gap-2">
                        {hebrewLocale.pages.admin.name}
                        {sortColumn === 'displayName' && (
                          sortAscending ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSortChange('email')}
                    >
                      <div className="flex items-center gap-2">
                        {hebrewLocale.pages.admin.email}
                        {sortColumn === 'email' && (
                          sortAscending ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>{hebrewLocale.pages.admin.role}</TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSortChange('createdAt')}
                    >
                      <div className="flex items-center gap-2">
                        {hebrewLocale.pages.admin.joinedDate}
                        {sortColumn === 'createdAt' && (
                          sortAscending ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />
                        )}
                      </div>
                    </TableHead>
                    <TableHead>{hebrewLocale.pages.admin.lastActive}</TableHead>
                    <TableHead
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSortChange('progressPercentage')}
                    >
                      <div className="flex items-center gap-2">
                        {hebrewLocale.pages.admin.progress}
                        {sortColumn === 'progressPercentage' && (
                          sortAscending ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />
                        )}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <>
                      {/* Main Row */}
                      <TableRow
                        key={user.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleToggleExpand(user.id)}
                      >
                        <TableCell>
                          {expandedUserId === user.id ? (
                            <IconChevronUp size={20} className="text-gray-400" />
                          ) : (
                            <IconChevronDown size={20} className="text-gray-400" />
                          )}
                        </TableCell>
                        <TableCell className="font-medium">{user.displayName}</TableCell>
                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${
                              user.isAdmin
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-muted text-gray-800'
                            }`}
                          >
                            {user.isAdmin
                              ? hebrewLocale.pages.admin.adminRole
                              : hebrewLocale.pages.admin.regularUser}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString('he-IL')}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {user.lastActiveAt
                            ? formatDistanceToNow(new Date(user.lastActiveAt), {
                                addSuffix: true,
                                locale: he,
                              })
                            : hebrewLocale.pages.admin.neverActive}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-emerald-500 h-2 rounded-full"
                                style={{ width: `${user.progressPercentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-semibold">{user.progressPercentage}%</span>
                          </div>
                        </TableCell>
                      </TableRow>

                      {/* Expanded Details Row */}
                      {expandedUserId === user.id && (
                        <TableRow>
                          <TableCell colSpan={7} className="bg-muted/50 p-6">
                            {isLoadingDetails ? (
                              <div className="text-center py-4 text-muted-foreground">
                                {hebrewLocale.pages.admin.loading}
                              </div>
                            ) : userDetails ? (
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Profile Details */}
                                <div className="space-y-3">
                                  <h4 className="font-semibold text-foreground">
                                    {hebrewLocale.pages.admin.profileDetails}
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <span className="text-muted-foreground">
                                        {hebrewLocale.pages.admin.email}:
                                      </span>{' '}
                                      <span className="font-medium">{userDetails.profile.email}</span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">
                                        {hebrewLocale.pages.admin.role}:
                                      </span>{' '}
                                      <span className="font-medium">
                                        {userDetails.profile.selectedRole || '-'}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">תחומי עניין:</span>{' '}
                                      <span className="font-medium">
                                        {userDetails.profile.selectedInterests.length > 0
                                          ? userDetails.profile.selectedInterests.join(', ')
                                          : '-'}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">רמת ניסיון:</span>{' '}
                                      <span className="font-medium">
                                        {userDetails.profile.experienceLevel || '-'}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Progress Details */}
                                <div className="space-y-3">
                                  <h4 className="font-semibold text-foreground">
                                    {hebrewLocale.pages.admin.progressDetails}
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <span className="text-muted-foreground">
                                        {hebrewLocale.pages.admin.totalProgress}:
                                      </span>{' '}
                                      <span className="font-medium">
                                        {userDetails.progress.totalProgress} מדריכים
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">
                                        {hebrewLocale.pages.admin.userGuidesCompleted}:
                                      </span>{' '}
                                      <span className="font-medium text-emerald-600">
                                        {userDetails.progress.guidesCompleted}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">
                                        {hebrewLocale.pages.admin.userGuidesInProgress}:
                                      </span>{' '}
                                      <span className="font-medium text-amber-600">
                                        {userDetails.progress.guidesInProgress}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Activity Details */}
                                <div className="space-y-3">
                                  <h4 className="font-semibold text-foreground">
                                    {hebrewLocale.pages.admin.activityDetails}
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <span className="text-muted-foreground">
                                        {hebrewLocale.pages.admin.notesCount}:
                                      </span>{' '}
                                      <span className="font-medium">{userDetails.activity.notesCount}</span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">
                                        {hebrewLocale.pages.admin.tasksCount}:
                                      </span>{' '}
                                      <span className="font-medium">{userDetails.activity.tasksCount}</span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">
                                        {hebrewLocale.pages.admin.commentsCount}:
                                      </span>{' '}
                                      <span className="font-medium">
                                        {userDetails.activity.commentsCount}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">
                                        {hebrewLocale.pages.admin.lastActivityDate}:
                                      </span>{' '}
                                      <span className="font-medium">
                                        {userDetails.activity.lastActivityDate
                                          ? new Date(
                                              userDetails.activity.lastActivityDate
                                            ).toLocaleDateString('he-IL')
                                          : hebrewLocale.pages.admin.neverActive}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="flex gap-2 mt-4">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewAsUser();
                                      }}
                                    >
                                      <IconEye size={16} className="ml-2" />
                                      {hebrewLocale.pages.admin.viewAsUser}
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteUser(user.id);
                                      }}
                                      disabled={deletingUserId === user.id}
                                    >
                                      <IconTrash size={16} className="ml-2" />
                                      {hebrewLocale.pages.admin.deleteUser}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-4 text-red-500">
                                שגיאה בטעינת פרטי משתמש
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t">
              <div className="text-sm text-muted-foreground">
                {hebrewLocale.pages.admin.pageOf
                  .replace('{current}', String(currentPage + 1))
                  .replace('{total}', String(totalPages))}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                >
                  <IconArrowRight size={16} className="ml-2" />
                  {hebrewLocale.pages.admin.prevPage}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages - 1}
                >
                  {hebrewLocale.pages.admin.nextPage}
                  <IconArrowLeft size={16} className="mr-2" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

