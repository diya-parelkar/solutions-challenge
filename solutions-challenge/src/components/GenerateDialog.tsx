import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from 'react-router-dom';
import LoginModal from "../pages/login";

export default function GenerateDialog({ prompt }: { prompt: string }) {
  const navigate = useNavigate();
  const [level, setLevel] = React.useState("");
  const [contentType, setContentType] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoginOpen, setIsLoginOpen] = React.useState(false);

  const handleGenerate = () => {
    const isAuthenticated = !!localStorage.getItem("token");

    if (!isAuthenticated) {
      setIsLoginOpen(true);
      return;
    }

    navigate({
      pathname: '/generated-website',
      search: `?prompt=${encodeURIComponent(prompt)}&level=${encodeURIComponent(level)}&contentType=${encodeURIComponent(contentType)}`
    });
    setIsOpen(false);
  };

  return (
    <>
      {/* The modal must be inside the JSX returned */}
      {isLoginOpen && (
        <LoginModal open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button className="h-12 px-6">Generate Website</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Customize Your Learning Experience</DialogTitle>
            <DialogDescription>
              Choose the level of explanation and content type that best fits your needs.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <label htmlFor="level" className="text-sm font-medium">
                Learning Level
              </label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Learning Levels</SelectLabel>
                    <SelectItem value="explain-like-im-5">Explain Like I'm 5</SelectItem>
                    <SelectItem value="school-kid">School Kid</SelectItem>
                    <SelectItem value="high-school">High School</SelectItem>
                    <SelectItem value="graduate-student">Graduate Student</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="contentType" className="text-sm font-medium">
                Content Type
              </label>
              <Select value={contentType} onValueChange={setContentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select content type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Content Types</SelectLabel>
                    <SelectItem value="concise">Concise - Quick Reads</SelectItem>
                    <SelectItem value="detailed">Long Form - Detailed</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerate} disabled={!level || !contentType}>
              Create Learning Website
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
