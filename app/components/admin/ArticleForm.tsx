"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Save, Eye } from "lucide-react";
import { toast } from "sonner";

interface ArticleFormProps {
  article?: {
    id: string;
    title: string;
    content: string;
    excerpt?: string;
    featuredImage?: string;
    published: boolean;
    tags: string[];
  };
}

export function ArticleForm({ article }: ArticleFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: article?.title || "",
    content: article?.content || "",
    excerpt: article?.excerpt || "",
    featuredImage: article?.featuredImage || "",
    published: article?.published || false,
    tags: article?.tags || [],
  });
  const [tagInput, setTagInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    setIsLoading(true);

    try {
      const url = article ? `/api/articles/${article.id}` : "/api/articles";
      const method = article ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save article");
      }

      const savedArticle = await response.json();
      toast.success(article ? "Article updated successfully" : "Article created successfully");
      router.push("/admin/articles");
    } catch (error) {
      console.error("Error saving article:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save article");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Article Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter article title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief description of the article"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content">Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your article content here..."
                  rows={15}
                  required
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Publish Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                />
                <Label htmlFor="published">Publish immediately</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Featured Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="featuredImage">Image URL</Label>
                <Input
                  id="featuredImage"
                  value={formData.featuredImage}
                  onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              {formData.featuredImage && (
                <div className="mt-4">
                  <Image
                    src={formData.featuredImage}
                    alt="Featured image preview"
                    className="w-full h-32 object-cover rounded-md"
                    width={400}
                    height={128}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={handleTagInputKeyPress}
                  placeholder="Add a tag"
                />
                <Button type="button" onClick={handleAddTag} size="sm">
                  Add
                </Button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        
        <div className="flex space-x-2">
          {article && (
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/articles/${article.id}`)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          )}
          
          <Button type="submit" disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : article ? "Update Article" : "Create Article"}
          </Button>
        </div>
      </div>
    </form>
  );
}
