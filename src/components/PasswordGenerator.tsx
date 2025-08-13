import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Copy, Check, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PasswordGenerator = () => {
  const [inputText, setInputText] = useState("");
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generatePassword = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some text to generate a password.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Use Web Crypto API for secure password generation
      const encoder = new TextEncoder();
      const data = encoder.encode(inputText);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      
      // Convert to base64 and add special characters for complexity
      const base64Hash = btoa(String.fromCharCode(...hashArray));
      
      // Create a more complex password by mixing with random elements
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
      let password = base64Hash.substring(0, 12);
      
      // Add random special characters at random positions
      for (let i = 0; i < 4; i++) {
        const randomChar = chars[Math.floor(Math.random() * chars.length)];
        const randomPos = Math.floor(Math.random() * password.length);
        password = password.substring(0, randomPos) + randomChar + password.substring(randomPos);
      }
      
      setGeneratedPassword(password.substring(0, 16));
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Failed to generate password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async () => {
    if (!generatedPassword) return;
    
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Password copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy password to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-[var(--shadow-card)] bg-gradient-to-b from-card to-muted border-border/50">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-primary-glow mb-4 shadow-[var(--shadow-glow)]">
            <Key className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Password Generator</h1>
          <p className="text-muted-foreground">Enter any text to create a secure password</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="input-text" className="text-sm font-medium text-foreground">
              Your Text
            </label>
            <Textarea
              id="input-text"
              placeholder="Enter any text here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="min-h-[100px] bg-muted/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-[var(--transition-smooth)] resize-none"
            />
          </div>

          <Button
            onClick={generatePassword}
            variant="secure"
            size="lg"
            className="w-full"
            disabled={!inputText.trim()}
          >
            <Key className="w-4 h-4 mr-2" />
            Generate Password
          </Button>

          {generatedPassword && (
            <div className="space-y-3 animate-fade-in">
              <label className="text-sm font-medium text-foreground">
                Generated Password
              </label>
              <div className="relative">
                <div className="p-4 bg-muted/30 border border-border/50 rounded-lg font-mono text-sm break-all text-foreground">
                  {generatedPassword}
                </div>
                <Button
                  onClick={copyToClipboard}
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-8 w-8 p-0 hover:bg-muted/50"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-primary" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default PasswordGenerator;