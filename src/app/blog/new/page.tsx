"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefreshCw, Sparkles, Wand2 } from "lucide-react";
import React, { useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import axios from "axios";
import {
  author_service,
 blogCategories,
  useAppData,
} from "@/context/AppContext";
import toast from "react-hot-toast";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const AddBlog = () => {
    interface PageResponse {
    message: string;
    html: string;
    token: string;
    user: {
      _id: string;
      name: string;
      email: string;
      image: string;
      instagram: string;
      facebook: string;
      linkedin: string;
      bio: string;
    };
  }
  interface Blog {
  id: string;
  html: string;
  title: string;
  description: string;
  blogcontent: string;
  image: string;
  category: string;
  author: string;
  created_at: string;
}
  const editor = useRef(null);
  const [content, setContent] = useState("");
const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { fetchBlogs } = useAppData();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    image: null,
    blogcontent: "",
  });

  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const fromDataToSend = new FormData();

    fromDataToSend.append("title", formData.title);
    fromDataToSend.append("description", formData.description);
    fromDataToSend.append("blogcontent", formData.blogcontent);
    fromDataToSend.append("category", formData.category);

    if (formData.image) {
      fromDataToSend.append("file", formData.image);
    }

    try {
      const token = Cookies.get("token");
      const { data } = await axios.post<PageResponse>(
        `${author_service}/api/v1/blog/new`,
        fromDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message);
      setFormData({
        title: "",
        description: "",
        category: "",
        image: null,
        blogcontent: "",
      });
      setContent("");
      if (fileInputRef.current) {
  fileInputRef.current.value = "";
}
      setTimeout(() => {
        fetchBlogs();
      }, 4000);
    } catch (error) {
      toast.error("Error while adding blog");
    } finally {
      setLoading(false);
    }
  };

  const [aiTitle, setAiTitle] = useState(false);

  const aiTitleResponse = async () => {
    try {
      setAiTitle(true);
      const { data } = await axios.post<Blog>(`${author_service}/api/v1/ai/title`, {
        text: formData.title,
      });
      setFormData({ ...formData, title: data.title ?? "" });
    } catch (error) {
      toast.error("Problem while fetching from ai");
      console.log(error);
    } finally {
      setAiTitle(false);
    }
  };

  const [aiDescripiton, setAiDescription] = useState(false);

  const aiDescriptionResponse = async () => {
    try {
      setAiDescription(true);
      const { data } = await axios.post<Blog>(
        `${author_service}/api/v1/ai/descripiton`,
        {
          title: formData.title,
          description: formData.description,
        }
      );
      setFormData({ ...formData, description: data.description ?? "" });
    } catch (error) {
      toast.error("Problem while fetching from ai");
      console.log(error);
    } finally {
      setAiDescription(false);
    }
  };

  const [aiBlogLoading, setAiBlogLoading] = useState(false);

  const aiBlogResponse = async () => {
    try {
      setAiBlogLoading(true);
      const { data } = await axios.post<Blog>(`${author_service}/api/v1/ai/blog`, {
        blog: formData.blogcontent,
      });
      setContent(data.html);
      setFormData({ ...formData, blogcontent: data.html ?? "" });
    } catch (error: any) {
      toast.error("Problem while fetching from ai");
      console.log(error);
    } finally {
      setAiBlogLoading(false);
    }
  };

  const config = useMemo(
    () => ({
      readonly: false, // all options from https://xdsoft.net/jodit/docs/,
      placeholder: "Start typings...",
    }),
    []
  );
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Add New Blog</h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Label>Title</Label>
            <div className="flex justify-center items-center gap-2">
              <Input
                name="title"
                value={formData.title?? ""}
                onChange={handleInputChange}
                placeholder="Enter Blog Title"
                className={
                  aiTitle ? "animate-pulse placeholder:opacity-60" : ""
                }
                required
              />
              {formData.title === "" ? (
                ""
              ) : (
                <Button
                  type="button"
                  onClick={aiTitleResponse}
                  disabled={aiTitle}
                >
                  
                  <Wand2 className={aiTitle ? "animate-spin" : ""} size={16} />
                   {!aiTitle && <span>Fix Title</span>}
                   
                </Button>
              )}
              
            </div>
           {formData.title && !aiTitle && (
  <p className="text-xs text-gray-500 mt-1 ml-1">
    Click “Fix Title” to improve title grammar using AI.
  </p>
)}

            <Label>Description</Label>
            <div className="flex justify-center items-center gap-2">
              <Input
                name="description"
                value={formData.description?? ""}
                onChange={handleInputChange}
                placeholder="Enter Blog Descripiton"
                className={
                  aiDescripiton ? "animate-pulse placeholder:opacity-60" : ""
                }
                required
              />
              {formData.title === "" ? (
                ""
              ) : (
                <Button
                  onClick={aiDescriptionResponse}
                  type="button"
                  disabled={aiDescripiton}
                >
                  <Sparkles className={aiDescripiton ? "animate-pulse" : ""} size={16} />
                  {!aiDescripiton && <span>AI Description</span>}
                </Button>
                
              )}
             
            </div>
             {formData.title && !aiDescripiton && (
  <p className="text-xs text-gray-500 mt-1 ml-1">
    Don’t want to write a description? Let AI do it for you.
  </p>
)}
            <Label>Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value: any) =>
                setFormData({ ...formData, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={formData.category || "Select category"}
                />
              </SelectTrigger>
              <SelectContent>
                {blogCategories?.map((e, i) => (
                  <SelectItem key={i} value={e}>
                    {e}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div>
              <Label className="mb-2">Image Upload</Label>
              <Input type="file" accept="image/*" onChange={handleFileChange}  ref={fileInputRef}/>
            </div>

            <div>
              <Label className="mb-2">Blog Content</Label>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-muted-foreground">
                  Paste you blog or type here. You can use rich text formatting.
                  Please add image after improving your grammer
                </p>
                <Button
                  type="button"
                  size={"sm"}
                  onClick={aiBlogResponse}
                  disabled={aiBlogLoading}
                >
                  <RefreshCw
                    size={16}
                    className={aiBlogLoading ? "animate-spin" : ""}
                  />
                  <span className="ml-2">Fix Grammer</span>
                </Button>
              </div>
              <JoditEditor
                ref={editor}
                value={content}
                config={config}
                tabIndex={1}
                onBlur={(newContent: string) => {
                  setContent(newContent);
                  setFormData({ ...formData, blogcontent: newContent });
                }}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting" : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddBlog;
