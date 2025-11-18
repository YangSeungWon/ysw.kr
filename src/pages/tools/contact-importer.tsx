import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Copy, QrCode as QrCodeIcon, FileText } from 'lucide-react';
import QRCode from 'qrcode';
import { toast, Toaster } from 'sonner';

interface Contact {
  name: string;
  phone: string;
  email?: string;
  organization?: string;
}

const ContactImporter: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [delimiter, setDelimiter] = useState('tab');
  const [prefix, setPrefix] = useState('');
  const [postfix, setPostfix] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [vcfContent, setVcfContent] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [error, setError] = useState('');

  const parseContacts = () => {
    try {
      setError('');
      const lines = inputText.trim().split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        setError('텍스트를 입력해주세요.');
        return;
      }

      const delimiterChar = delimiter === 'tab' ? '\t' : delimiter === 'comma' ? ',' : ';';
      const parsedContacts: Contact[] = [];

      lines.forEach((line, index) => {
        const parts = line.split(delimiterChar).map(part => part.trim());
        
        if (parts.length < 2) {
          throw new Error(`${index + 1}번째 줄: 이름과 전화번호가 필요합니다.`);
        }

        // Apply prefix and postfix to name
        const baseName = parts[0];
        const fullName = `${prefix}${baseName}${postfix}`.trim();

        const contact: Contact = {
          name: fullName,
          phone: parts[1].replace(/[^\d+\-\s]/g, ''), // 전화번호에서 특수문자 제거
        };

        // 이메일 패턴 검사
        if (parts[2] && parts[2].includes('@')) {
          contact.email = parts[2];
          if (parts[3]) contact.organization = parts[3];
        } else if (parts[2]) {
          contact.organization = parts[2];
        }

        parsedContacts.push(contact);
      });

      setContacts(parsedContacts);
      generateVCF(parsedContacts);
    } catch (err) {
      setError(err instanceof Error ? err.message : '파싱 중 오류가 발생했습니다.');
      setContacts([]);
      setVcfContent('');
      setQrCodeUrl('');
    }
  };

  const generateVCF = (contactList: Contact[]) => {
    let vcf = '';
    
    contactList.forEach(contact => {
      vcf += 'BEGIN:VCARD\n';
      vcf += 'VERSION:3.0\n';
      vcf += `FN:${contact.name}\n`;
      vcf += `N:${contact.name};;;;\n`;
      
      // 전화번호 포맷팅
      const formattedPhone = contact.phone.replace(/[^\d+]/g, '');
      vcf += `TEL;TYPE=CELL:${formattedPhone}\n`;
      
      if (contact.email) {
        vcf += `EMAIL:${contact.email}\n`;
      }
      
      if (contact.organization) {
        vcf += `ORG:${contact.organization}\n`;
      }
      
      vcf += 'END:VCARD\n\n';
    });

    setVcfContent(vcf.trim());
  };

  const downloadVCF = () => {
    if (!vcfContent) return;

    const blob = new Blob([vcfContent], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `contacts_${new Date().toISOString().slice(0, 10)}.vcf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const generateQR = async () => {
    if (!vcfContent) return;

    try {
      // VCF 내용이 너무 길면 QR 코드 생성이 어려울 수 있음
      if (vcfContent.length > 2000) {
        setError('연락처가 너무 많아 QR 코드를 생성할 수 없습니다. VCF 파일을 다운로드해주세요.');
        return;
      }

      const qrDataUrl = await QRCode.toDataURL(vcfContent, {
        width: 400,
        margin: 2,
        errorCorrectionLevel: 'L'
      });
      setQrCodeUrl(qrDataUrl);
    } catch (err) {
      setError('QR 코드 생성 중 오류가 발생했습니다.');
    }
  };

  const copyToClipboard = () => {
    if (!vcfContent) return;

    navigator.clipboard.writeText(vcfContent).then(() => {
      toast.success('VCF 내용이 클립보드에 복사되었습니다.');
    }).catch(() => {
      toast.error('클립보드 복사에 실패했습니다.');
    });
  };

  const exampleText = `홍길동\t010-1234-5678\tgildong@example.com\t회사명
김철수\t010-9876-5432\tcheolsu@example.com
박영희\t010-5555-6666`;

  return (
    <Layout title="Contact Importer">
      <Toaster />
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-center">연락처 일괄 가져오기</h1>
          </div>
          <p className="text-muted-foreground text-center">스프레드시트에서 안드로이드 연락처로</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>연락처 데이터 입력</CardTitle>
              <CardDescription>
                스프레드시트에서 복사한 연락처를 VCF 파일로 변환
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>구분자 선택</Label>
                  <Select value={delimiter} onValueChange={setDelimiter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tab">탭 (Tab)</SelectItem>
                      <SelectItem value="comma">쉼표 (,)</SelectItem>
                      <SelectItem value="semicolon">세미콜론 (;)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prefix">이름 앞에 붙이기 (Prefix)</Label>
                  <Input
                    id="prefix"
                    type="text"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    placeholder="예: [회사명] "
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postfix">이름 뒤에 붙이기 (Postfix)</Label>
                  <Input
                    id="postfix"
                    type="text"
                    value={postfix}
                    onChange={(e) => setPostfix(e.target.value)}
                    placeholder="예:  (팀명)"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>
                  연락처 데이터 입력 (한 줄에 하나씩)
                </Label>
                <p className="text-sm text-muted-foreground">
                  형식: 이름{delimiter === 'tab' ? '\t' : delimiter === 'comma' ? ',' : ';'}전화번호{delimiter === 'tab' ? '\t' : delimiter === 'comma' ? ',' : ';'}이메일(선택){delimiter === 'tab' ? '\t' : delimiter === 'comma' ? ',' : ';'}회사(선택)
                  {(prefix || postfix) && (
                    <span className="block mt-1 text-primary">
                      → 저장될 이름: {prefix}이름{postfix}
                    </span>
                  )}
                </p>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={exampleText}
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex gap-2">
                <Button variant="docusaurus" onClick={parseContacts}>
                  연락처 파싱
                </Button>
                <Button
                  variant="docusaurus"
                  onClick={() => setInputText(exampleText)}
                >
                  예제 데이터 사용
                </Button>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {contacts.length > 0 && (
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">
                      파싱된 연락처 ({contacts.length}개)
                    </h3>

                    <div className="border rounded-lg overflow-hidden mb-4">
                      <table className="w-full">
                        <thead className="bg-muted">
                          <tr>
                            <th className="text-left p-2 font-medium">이름</th>
                            <th className="text-left p-2 font-medium">전화번호</th>
                            <th className="text-left p-2 font-medium">이메일</th>
                            <th className="text-left p-2 font-medium">회사</th>
                          </tr>
                        </thead>
                        <tbody>
                          {contacts.slice(0, 10).map((contact, idx) => (
                            <tr key={idx} className="border-t">
                              <td className="p-2">{contact.name}</td>
                              <td className="p-2 font-mono text-sm">{contact.phone}</td>
                              <td className="p-2 text-sm">{contact.email || '-'}</td>
                              <td className="p-2 text-sm">{contact.organization || '-'}</td>
                            </tr>
                          ))}
                          {contacts.length > 10 && (
                            <tr className="border-t">
                              <td colSpan={4} className="p-2 text-center text-muted-foreground">
                                ... 그 외 {contacts.length - 10}개
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Button variant="docusaurus" onClick={downloadVCF} className="gap-2">
                      <Download className="w-4 h-4" />
                      VCF 파일 다운로드
                    </Button>
                    <Button variant="docusaurus" onClick={copyToClipboard} className="gap-2">
                      <Copy className="w-4 h-4" />
                      VCF 내용 복사
                    </Button>
                    {contacts.length <= 10 && (
                      <Button variant="docusaurus" onClick={generateQR} className="gap-2">
                        <QrCodeIcon className="w-4 h-4" />
                        QR 코드 생성
                      </Button>
                    )}
                  </div>

                  {qrCodeUrl && (
                    <div className="space-y-2">
                      <h4 className="text-md font-semibold">QR 코드</h4>
                      <p className="text-sm text-muted-foreground">
                        안드로이드 기기에서 QR 코드를 스캔하여 연락처를 가져올 수 있습니다.
                      </p>
                      <div className="border rounded-lg p-4 bg-white inline-block">
                        <img
                          src={qrCodeUrl}
                          alt="Contact QR Code"
                          className="max-w-[300px]"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>사용 방법</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Excel, Google Sheets 등에서 연락처 데이터를 복사합니다.</li>
                <li>위 입력란에 붙여넣기 합니다.</li>
                <li>구분자를 선택하고 "연락처 파싱" 버튼을 클릭합니다.</li>
                <li>VCF 파일을 다운로드하거나 QR 코드를 생성합니다.</li>
                <li>안드로이드 기기에서:
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>VCF 파일: 연락처 앱 → 설정 → 가져오기</li>
                    <li>QR 코드: QR 스캐너로 스캔 → 연락처 추가</li>
                  </ul>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ContactImporter;