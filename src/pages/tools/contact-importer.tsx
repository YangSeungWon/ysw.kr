import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import QRCode from 'qrcode';

interface Contact {
  name: string;
  phone: string;
  email?: string;
  organization?: string;
}

const ContactImporter: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [delimiter, setDelimiter] = useState('tab');
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

        const contact: Contact = {
          name: parts[0],
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
      alert('VCF 내용이 클립보드에 복사되었습니다.');
    }).catch(() => {
      setError('클립보드 복사에 실패했습니다.');
    });
  };

  const exampleText = `홍길동\t010-1234-5678\tgildong@example.com\t회사명
김철수\t010-9876-5432\tcheolsu@example.com
박영희\t010-5555-6666`;

  return (
    <Layout title="Contact Importer">
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-6">연락처 일괄 가져오기</h1>
        
        <div className="max-w-4xl mx-auto">
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">스프레드시트 → 안드로이드 연락처</h2>
            
            <div className="space-y-4">
              <div>
                <Label className="block mb-2">구분자 선택</Label>
                <Select value={delimiter} onValueChange={setDelimiter}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tab">탭 (Tab)</SelectItem>
                    <SelectItem value="comma">쉼표 (,)</SelectItem>
                    <SelectItem value="semicolon">세미콜론 (;)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="block mb-2">
                  연락처 데이터 입력 (한 줄에 하나씩)
                </Label>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  형식: 이름{delimiter === 'tab' ? '\t' : delimiter === 'comma' ? ',' : ';'}전화번호{delimiter === 'tab' ? '\t' : delimiter === 'comma' ? ',' : ';'}이메일(선택){delimiter === 'tab' ? '\t' : delimiter === 'comma' ? ',' : ';'}회사(선택)
                </div>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={exampleText}
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={parseContacts}>
                  연락처 파싱
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setInputText(exampleText)}
                >
                  예제 데이터 사용
                </Button>
              </div>

              {error && (
                <div className="alert alert--danger">
                  {error}
                </div>
              )}

              {contacts.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">
                    파싱된 연락처 ({contacts.length}개)
                  </h3>
                  
                  <div className="border rounded-lg overflow-hidden mb-4">
                    <table className="w-full">
                      <thead className="bg-gray-100 dark:bg-gray-800">
                        <tr>
                          <th className="text-left p-2">이름</th>
                          <th className="text-left p-2">전화번호</th>
                          <th className="text-left p-2">이메일</th>
                          <th className="text-left p-2">회사</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contacts.slice(0, 10).map((contact, idx) => (
                          <tr key={idx} className="border-t">
                            <td className="p-2">{contact.name}</td>
                            <td className="p-2 font-mono">{contact.phone}</td>
                            <td className="p-2 text-sm">{contact.email || '-'}</td>
                            <td className="p-2 text-sm">{contact.organization || '-'}</td>
                          </tr>
                        ))}
                        {contacts.length > 10 && (
                          <tr className="border-t">
                            <td colSpan={4} className="p-2 text-center text-gray-500">
                              ... 그 외 {contacts.length - 10}개
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <Button onClick={downloadVCF}>
                      VCF 파일 다운로드
                    </Button>
                    <Button variant="outline" onClick={copyToClipboard}>
                      VCF 내용 복사
                    </Button>
                    {contacts.length <= 10 && (
                      <Button variant="outline" onClick={generateQR}>
                        QR 코드 생성
                      </Button>
                    )}
                  </div>

                  {qrCodeUrl && (
                    <div className="mt-6">
                      <h4 className="text-md font-semibold mb-2">QR 코드</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        안드로이드 기기에서 QR 코드를 스캔하여 연락처를 가져올 수 있습니다.
                      </p>
                      <img 
                        src={qrCodeUrl} 
                        alt="Contact QR Code"
                        className="border rounded"
                        style={{ maxWidth: '300px' }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-semibold mb-3">사용 방법</h3>
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
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactImporter;