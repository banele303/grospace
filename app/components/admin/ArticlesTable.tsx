"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Article {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  author: {
    firstName: string;
    lastName: string;
    profileImage: string;
  };
}

interface ArticlesTableProps {
  articles: Article[];
}

export function ArticlesTable({ articles: initialArticles }: ArticlesTableProps) {
  const [articles, setArticles] = useState(initialArticles);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleDelete = async (articleId: string) => {
    setIsDeleting(articleId);
    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete article");
      }

      setArticles(articles.filter(article => article.id !== articleId));
      toast.success("Article deleted successfully");
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Failed to delete article");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Published Date</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8">
                <div className="text-gray-500 dark:text-gray-400">
                  No articles found. Create your first article to get started.
                </div>
              </TableCell>
            </TableRow>
          ) : (
            articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="font-medium">
                  <div className="max-w-xs truncate">
                    {article.title}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <img
                      src={article.author.profileImage || "/default-avatar.png"}
                      alt={`${article.author.firstName} ${article.author.lastName}`}
                      className="h-6 w-6 rounded-full"
                    />
                    <span className="text-sm">
                      {article.author.firstName} {article.author.lastName}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={article.published ? "default" : "secondary"}>
                    {article.published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell>
                  {article.publishedAt 
                    ? format(new Date(article.publishedAt), "MMM dd, yyyy")
                    : "-"
                  }
                </TableCell>
                <TableCell>
                  {format(new Date(article.createdAt), "MMM dd, yyyy")}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/articles/${article.slug}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/admin/articles/${article.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the article.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(article.id)}
                              disabled={isDeleting === article.id}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              {isDeleting === article.id ? "Deleting..." : "Delete"}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
